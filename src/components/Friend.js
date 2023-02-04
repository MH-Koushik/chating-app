import React, { useEffect, useState } from 'react'
import { getDatabase, ref, onValue,set, push, remove} from "firebase/database";
import { useSelector } from 'react-redux';
import {SlOptionsVertical} from 'react-icons/sl'

const Friend = () => {

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










  return (
    <div className=' relative mt-[10px] w-full h-[447px] px-5 py-3.5 bg-white rounded-[20px] drop-shadow-lg '>
    <p className='font-Poppins font-semibold text-xl mb-4'>Friends</p>
    <SlOptionsVertical className='absolute top-[20px] right-[20px] text-[19px] text-button cursor-pointer'/>

    <div className='overflow-y-auto h-[368px] scroll-smooth last:border-0'>

        {friendslist.map((item)=>(
        <div className='flex items-center gap-x-3.5 w-[95%] pb-3.5 border-b border-black/[0.25] mb-3.5'>
        <div className='w-[20%]'>
            <img src={(userdata.uid==item.receiverID)? item.senderPhotoURL : item.receiverPhotoURL} className='rounded-full w-[70px] h-[70px]'/>
        </div>
        <div className='w-[50%]'>
            <h3 className='font-Poppins font-semibold text-lg'>{item.senderName}</h3>
            <p className='font-Poppins font-semibold font-medium text-ptag/[0.75] text-sm'>{(userdata.uid==item.receiverID) ? item.senderMail : item.receiverMail}</p>
        </div>
        <div className='flex justify-end w-[30%]'>
        <div className='text-center'>
        <button onClick={()=>handleUnFriend(item.friendKey)} className='px-[10px] py-[5px] bg-button font-semibold font-Poppins text-[15px] text-white rounded-[5px] mb-[5px]'>Unfriend</button>
        <button onClick={()=>handleBlock(item)} className='px-[22px] py-[5px] bg-red-500 font-semibold font-Poppins text-[15px] text-white rounded-[5px]'>Block</button>
        </div>
        </div>
    </div> )
        )}



        

    </div>

</div>
  )
}

export default Friend