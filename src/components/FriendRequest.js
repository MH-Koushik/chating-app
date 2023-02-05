import {SlOptionsVertical} from 'react-icons/sl'
import React, { useEffect, useState } from 'react'
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








  return (
    <div className=' relative mt-[15px] w-full h-[447px] px-5 py-3.5 bg-white rounded-[20px] drop-shadow-lg '>
        <p className='font-Poppins font-semibold text-xl mb-4'>Friend  Request</p>
        <SlOptionsVertical className='absolute top-[20px] right-[20px] text-[19px] text-button cursor-pointer'/>

        <div className='overflow-y-auto h-[368px] scroll-smooth last:border-0'>
        {friendRequest.map((item)=>(
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
        ))}

        </div>

    </div>
  )
}

export default FriendRequest