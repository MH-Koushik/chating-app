import React, { useEffect, useState } from 'react'
import { getDatabase, ref, onValue,set, push, remove} from "firebase/database";
import {FiSearch} from 'react-icons/fi'
import { useSelector } from 'react-redux';
const FriendChat = () => {

    let userdata=useSelector((state)=>state.userLoginInfo.userInfo)
    const db = getDatabase()
    let [friendslist, setFriendsList]= useState([]);

    useEffect(()=>{
        const userRef = ref(db, 'friends');
        onValue(userRef, (snapshot) => {
            let friendsarr=[]
            snapshot.forEach((item)=>{
                if(userdata.uid==item.val().receiverID || userdata.uid==item.val().senderID){
                    friendsarr.push({...item.val(), friendKey: item.key });
                }
                
            })
            setFriendsList(friendsarr);
        });

    },[userdata])


    let handleUnFriend=(item)=>{
        remove(ref(db, 'friends/'+ item))
    }

    // Blocking an user
    let handleBlock=(item)=>{
        if(userdata.uid==item.senderID){
            set(push(ref(db, 'block')), {
                blockID: item.receiverID,
                blockName: item.receiverName,
                blockMail: item.receiverMail,
                blockPhoto:item.receiverPhotoURL,
                blockbyID: item.senderID,
                blockbyName: item.senderName,
              }).then(()=>{
                remove(ref(db, 'friends/' + item.friendKey))
              })
        } else{
            set(push(ref(db, 'block')), {
                blockID: item.senderID,
                blockName: item.senderName,
                blockMail: item.senderMail,
                blockPhoto: item.senderPhotoURL,
                blockbyID: item.receiverID,
                blockbyName: item.receiverName,
              }).then(()=>{
                remove(ref(db, 'friends/' + item.friendKey))
              })
        }
    }

    let[userSearchList, setUserSearchList]=useState([])
    let handleSearch=(e)=>{
        console.log(e.target.value)
        let arr=[]
        if(e.target.value.length==0){
            setUserSearchList([])
        }else{
            friendslist.map((item)=>{
                if(userdata.uid==item.receiverID){
                    if(item.senderName.toLowerCase().includes(e.target.value.toLowerCase())){
                        arr.push(item)
                    }
                }else{
                    if(item.receiverName.toLowerCase().includes(e.target.value.toLowerCase())){
                        arr.push(item)
                    }
                }
            })
            setUserSearchList(arr)
        }
    }
    

  return (
    <div className=' relative mt-[10px] w-full h-[447px] px-5 py-3.5 bg-white rounded-[20px] drop-shadow-lg '>
    <div className='flex w-full mb-4'>
        <p className='w-2/5 font-Poppins font-semibold text-xl mt-3 '>Friends</p>
        <div className='w-3/5  relative'>
            <input onChange={handleSearch} type='text' placeholder='Search' className='  w-[100px]] h-[49px] px-12 py-4 drop-shadow-lg outline-0  rounded-[20px]'/>
            <FiSearch className='absolute top-[16px] left-[15px] text-[19px]'/>
        </div>
    </div>

<div className='overflow-y-auto h-[368px] scroll-smooth last:border-0'>
    {userSearchList.length>0?
        userSearchList.map((item)=>(
            <div className='cursor-pointer flex items-center gap-x-3.5 w-[95%] pb-3.5 border-b border-black/[0.25] mb-3.5'>
                <div className='w-[20%]'>
                    <img src={(userdata.uid==item.receiverID)? item.senderPhotoURL : item.receiverPhotoURL} className='rounded-full w-[70px] h-[70px]'/>
                </div>
                <div className='w-[50%]'>
                    <h3 className='font-Poppins font-semibold text-lg'>{(userdata.uid==item.receiverID)?item.senderName : item.receiverName}</h3>
                    <p className='font-Poppins font-semibold font-medium text-ptag/[0.75] text-sm'>{(userdata.uid==item.receiverID) ? item.senderMail : item.receiverMail}</p>
                </div>
            </div> )
            )
    :
     (
        friendslist.length==0?
            <div className='h-full flex justify-center items-center'>
                <div>
                    <h3 className='font-Poppins font-semibold text-2xl'>No Friend Exist</h3>
                </div>
            </div>
    :
    (friendslist.map((item)=>(
    <div className='cursor-pointer flex items-center gap-x-3.5 w-[95%] pb-3.5 border-b border-black/[0.25] mb-3.5'>
        <div className='w-[20%]'>
            <img src={(userdata.uid==item.receiverID)? item.senderPhotoURL : item.receiverPhotoURL} className='rounded-full w-[70px] h-[70px]'/>
        </div>
        <div className='w-[50%]'>
            <h3 className='font-Poppins font-semibold text-lg'>{(userdata.uid==item.receiverID)?item.senderName : item.receiverName}</h3>
            <p className='font-Poppins font-semibold font-medium text-ptag/[0.75] text-sm'>{(userdata.uid==item.receiverID) ? item.senderMail : item.receiverMail}</p>
        </div>
    </div> )
    ))
     )
    }

</div>

</div>


  )
}


export default FriendChat