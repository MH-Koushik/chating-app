import React, { useEffect, useState } from 'react'
import {SlOptionsVertical} from 'react-icons/sl'

import {FiSearch} from 'react-icons/fi'

import { getDatabase, ref, onValue,set, push} from "firebase/database";
import { useSelector } from 'react-redux';

const UserList = () => {
    
    let[userList, setUserList]=useState([])

    let[userSearchList, setUserSearchList]=useState([])

    let[friendRequestList, setFriendRequestList]=useState([])
    let[friendsList, setFriendsList]=useState([])
    let[blockList, setBlockList]=useState([])
    const db = getDatabase();
    let userdata=useSelector((state)=>state.userLoginInfo.userInfo)
    
    useEffect(()=>{
        const userRef = ref(db, 'users');
        onValue(userRef, (snapshot) => {
            let userarr=[]
            snapshot.forEach((item)=>{
                if(userdata.uid != item.key){
                    userarr.push({...item.val(), userId: item.key})
                }
            })
            setUserList(userarr)
        });
    },[userdata])

    let handleFriendRequest=(item)=>{
        set(push(ref(db, 'friendRequest')), {
            receiverName: item.username,
            senderName: userdata.displayName,
            receiverID: item.userId,
            senderID: userdata.uid,
            senderPhotoURL: userdata.photoURL,
            receiverPhotoURL: item.photoURL,
            senderMail: userdata.email,
            receiverMail: item.email,
          });
    }

    useEffect(()=>{
        const userRef = ref(db, 'friendRequest');
        onValue(userRef, (snapshot) => {
            let friendRequestarr=[]
            snapshot.forEach((item)=>{
                friendRequestarr.push(item.val().receiverID + item.val().senderID); //for the button check on userlist
            })
            setFriendRequestList(friendRequestarr);
        });
    },[userdata])

    useEffect(()=>{
        const userRef = ref(db, 'friends');
        onValue(userRef, (snapshot) => {
            let friendsarr=[]
            snapshot.forEach((item)=>{
                friendsarr.push(item.val().receiverID + item.val().senderID);
            })
            setFriendsList(friendsarr);
        });
    },[userdata])

    useEffect(()=>{
        const userRef = ref(db, 'block');
        onValue(userRef, (snapshot) => {
            let blockarr=[]
            snapshot.forEach((item)=>{
                blockarr.push(item.val().blockID + item.val().blockbyID);
            })
            setBlockList(blockarr);
        });
    },[userdata])

    let handleSearch=(e)=>{
        let arr=[]
        if(e.target.value.length==0){
            setUserSearchList([])
        }else{
            userList.map((item)=>{
                if(item.username.toLowerCase().includes(e.target.value.toLowerCase())){
                    arr.push(item)
                }
            })
            setUserSearchList(arr)
        }
    }
    




  return (
    <div className=' relative mt-[10px] w-full h-[447px] px-5 py-3.5 bg-white rounded-[20px] drop-shadow-lg '>

        <div className='flex w-full mb-4'>
            <p className='w-2/5 font-Poppins font-semibold text-xl mt-3 '>User List</p>
            <div className='w-3/5  relative'>
                <input onChange={handleSearch} type='text' placeholder='Search' className='  w-[100px]] h-[49px] px-12 py-4 drop-shadow-lg outline-0  rounded-[20px]'/>
                <FiSearch className='absolute top-[16px] left-[15px] text-[19px]'/>
            </div>
        </div>

        <div className='overflow-y-auto h-[368px] scroll-smooth '>

        {userSearchList.length>0? 
            userSearchList.map((item)=>(
                <div className='flex items-center gap-x-3.5 w-[95%] pb-3.5 border-b border-black/[0.25] mb-3.5'>
                <div className='w-[20%]'>
                    <img src={item.photoURL} className='rounded-full w-[70px] h-[70px]'/>
                </div>
                <div className='w-[50%]'>
                    <h3 className='font-Poppins font-semibold text-lg'>{item.username}</h3>
                    <p className='font-Poppins font-semibold font-medium text-ptag/[0.75] text-sm'>{item.email}</p>
                </div>
                <div className='flex justify-end w-[30%]'>
                    
                    {friendsList.includes(item.userId+userdata.uid) || friendsList.includes(userdata.uid+item.userId)? <button className='px-[20px] py-[5px] bg-button font-semibold font-Poppins text-[18px] text-white rounded-[5px]'>Friend</button>
                    : 
                    friendRequestList.includes(item.userId+userdata.uid) || friendRequestList.includes(userdata.uid+item.userId) ? <button className='px-[15px] py-[5px] bg-button font-semibold font-Poppins text-[18px] text-white rounded-[5px]'>Pending</button> 
                    : blockList.includes(item.userId+userdata.uid) || blockList.includes(userdata.uid+item.userId) ? <p className=''> </p>
                    :
                    <button onClick={()=>handleFriendRequest(item)} className='px-[8px] py-[5px] bg-button font-semibold font-Poppins text-[16px] text-white rounded-[5px]'>Add Friend</button>}
                    
                </div>
            </div> 
            ))
            :
            userList.map((item)=>(
                <div className='flex items-center gap-x-3.5 w-[95%] pb-3.5 border-b border-black/[0.25] mb-3.5'>
                <div className='w-[20%]'>
                    <img src={item.photoURL} className='rounded-full w-[70px] h-[70px]'/>
                </div>
                <div className='w-[50%]'>
                    <h3 className='font-Poppins font-semibold text-lg'>{item.username}</h3>
                    <p className='font-Poppins font-semibold font-medium text-ptag/[0.75] text-sm'>{item.email}</p>
                </div>
                <div className='flex justify-end w-[30%]'>
                    
                    {friendsList.includes(item.userId+userdata.uid) || friendsList.includes(userdata.uid+item.userId)? <button className='px-[20px] py-[5px] bg-button font-semibold font-Poppins text-[18px] text-white rounded-[5px]'>Friend</button>
                    : 
                    friendRequestList.includes(item.userId+userdata.uid) || friendRequestList.includes(userdata.uid+item.userId) ? <button className='px-[15px] py-[5px] bg-button font-semibold font-Poppins text-[18px] text-white rounded-[5px]'>Pending</button> 
                    : blockList.includes(item.userId+userdata.uid) || blockList.includes(userdata.uid+item.userId) ? <p className=''> </p>
                    :
                    <button onClick={()=>handleFriendRequest(item)} className='px-[8px] py-[5px] bg-button font-semibold font-Poppins text-[16px] text-white rounded-[5px]'>Add Friend</button>}
                    
                </div>
            </div> 
            ))
            }
            
        </div>

    </div>
  )
}

export default UserList