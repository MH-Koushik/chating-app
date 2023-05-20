import {SlOptionsVertical} from 'react-icons/sl'
import React, { useEffect, useState } from 'react'
import {FiSearch} from 'react-icons/fi'
import { getDatabase, ref, onValue,set, push, remove} from "firebase/database";
import { useSelector } from 'react-redux';
const FriendRequest = () => {
    const db = getDatabase();
    let [friendRequest, setFriendRequest] = useState([]);
    let userdata=useSelector((state)=>state.userLoginInfo.userInfo)
    
    // Reading Friend Request from Database
    useEffect(()=>{
        const userRef = ref(db, 'friendRequest');
        onValue(userRef, (snapshot) => {
            let friendRequestarr=[]
            snapshot.forEach((item)=>{
                if(userdata.uid==item.val().receiverID){
                    friendRequestarr.push({...item.val(), friendRequestKey: item.key });
                }
                
            })
            setFriendRequest(friendRequestarr);
        });

    },[userdata])

    // Accepting Friend Request
    let handleFriendAccept=(item)=>{
        set(push(ref(db, 'friends')), {
            ...item,
          }).then(()=>{
            remove( ref(db, 'friendRequest/'+item.friendRequestKey) )
          })
    }
    // Rejecting Friend Request
    let handleFriendReject=(item)=>{
            remove( ref(db, 'friendRequest/'+item.friendRequestKey) )
    }

    let[userSearchList, setUserSearchList]=useState([])
    let handleSearch=(e)=>{
        console.log(e.target.value)
        let arr=[]
        if(e.target.value.length==0){
            setUserSearchList([])
        }else{
            friendRequest.map((item)=>{
                if(item.senderName.toLowerCase().includes(e.target.value.toLowerCase())){
                    arr.push(item)
                }
            })
            setUserSearchList(arr)
        }
    }
    







  return (
    <div className=' relative mt-[15px] w-full h-[447px] px-5 py-3.5 bg-white rounded-[20px] drop-shadow-lg '>
        
        <div className='flex w-full mb-4'>
            <p className='w-2/5 font-Poppins font-semibold text-xl mt-3 '>Friend Requests</p>
            <div className='w-3/5  relative'>
                <input onChange={handleSearch} type='text' placeholder='Search' className='  w-[100px]] h-[49px] px-12 py-4 drop-shadow-lg outline-0  rounded-[20px]'/>
                <FiSearch className='absolute top-[16px] left-[15px] text-[19px]'/>
            </div>
        </div>

        <div className='overflow-y-auto h-[368px] scroll-smooth last:border-0'>
        {userSearchList.length>0? 
            userSearchList.map((item)=>(
                <div className='flex items-center gap-x-3.5 w-[95%] pb-3.5 border-b border-black/[0.25] mb-3.5'>
                    <div className='w-[20%]'>
                        <img src={item.senderPhotoURL} className='rounded-full w-[70px] h-[70px]'/>
                    </div>
                    <div className='w-[60%]'>
                        <h3 className='font-Poppins font-semibold text-lg'>{item.senderName}</h3>
                        <p className='font-Poppins font-semibold font-medium text-ptag/[0.75] text-sm'>{item.senderMail}</p>
                    </div>
                    <div className='flex justify-end w-[20%]'>
                        <button onClick={()=>handleFriendAccept(item)} className='font-Poppins font-semibold text-[15px] text-white py-1.5 px-[10px] bg-button rounded-[5px] mr-[5px]'>Accept</button>  
                        <button onClick={()=>handleFriendReject(item)} className='font-Poppins font-semibold text-[15px] text-white py-1.5 px-[10px] bg-red-500 rounded-[5px]'>Reject</button>  
                    </div>
                </div>
            ))
        :
          (friendRequest.length==0?
                <div className='h-full flex justify-center items-center'>
                    <div>
                        <h3 className='font-Poppins font-semibold text-2xl'>No Friend Request Exist</h3>
                    </div>
                </div>
            :
            (friendRequest.map((item)=>(
                        <div className='flex items-center gap-x-3.5 w-[95%] pb-3.5 border-b border-black/[0.25] mb-3.5'>
                            <div className='w-[20%]'>
                                <img src={item.senderPhotoURL} className='rounded-full w-[70px] h-[70px]'/>
                            </div>
                            <div className='w-[60%]'>
                                <h3 className='font-Poppins font-semibold text-lg'>{item.senderName}</h3>
                                <p className='font-Poppins font-semibold font-medium text-ptag/[0.75] text-sm'>{item.senderMail}</p>
                            </div>
                            <div className='flex justify-end w-[20%]'>
                                <button onClick={()=>handleFriendAccept(item)} className='font-Poppins font-semibold text-[15px] text-white py-1.5 px-[10px] bg-button rounded-[5px] mr-[5px]'>Accept</button>  
                                <button onClick={()=>handleFriendReject(item)} className='font-Poppins font-semibold text-[15px] text-white py-1.5 px-[10px] bg-red-500 rounded-[5px]'>Reject</button>  
                            </div>
                        </div>
            )))
          )
        }

        </div>

    </div>
  )
}

export default FriendRequest