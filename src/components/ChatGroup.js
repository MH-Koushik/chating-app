import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import {FiSearch} from 'react-icons/fi'
import { getDatabase, ref, onValue,set, push, remove} from "firebase/database";

const ChatGroup = () => {
    let userdata=useSelector((state)=>state.userLoginInfo.userInfo)
    const db = getDatabase()
    let [groupList,setGroupList]=useState([])
    let [membergroupList,setMembergroupList]=useState([])


    
    useEffect(()=>{
        const groupMemberRef = ref(db, 'GroupMember');
        onValue(groupMemberRef, (snapshot) => {
            let membergrouparr=[]
            snapshot.forEach((item)=>{
                if(userdata.uid==item.val().memberID){
                    membergrouparr.push(item.val().groupID);
                }
            })
            setMembergroupList(membergrouparr);
        });
    },[])


    useEffect(()=>{
        const groupRef = ref(db, 'group');
        onValue(groupRef, (snapshot) => {
            let grouparr=[]
            snapshot.forEach((item)=>{ 
                    grouparr.push({...item.val(), groupKey: item.key });
            })
            setGroupList(grouparr);
        });
    },[])



    let[userSearchList, setUserSearchList]=useState([])
    
    let handleSearch=(e)=>{
        console.log(e.target.value)
        let arr=[]
        if(e.target.value.length==0){
            setUserSearchList([])
        }else{
            groupList.map((item)=>{
                if(item.groupName.toLowerCase().includes(e.target.value.toLowerCase())){
                    arr.push(item)
                }
            })
            setUserSearchList(arr)
        }
    }
    


  return (

    <div className=' relative mt-[10px] w-full h-[447px] px-5 py-3.5 bg-white rounded-[20px] drop-shadow-lg'>
    <div className='flex w-full mb-10'>
        <p className='w-2/5 font-Poppins font-semibold text-xl mt-3 '>Groups</p>
        <div className='w-3/5  relative'>
            <input onChange={handleSearch} type='text' placeholder='Search' className='  w-[100px]] h-[49px] px-12 py-4 drop-shadow-lg outline-0  rounded-[20px]'/>
            <FiSearch className='absolute top-[16px] left-[15px] text-[19px]'/>
        </div>
    </div>

    <div className='overflow-y-auto h-[276px] scroll-smooth'>

    {userSearchList.length>0?
        userSearchList.map((item)=>(
            ((item.adminId==userdata.uid || membergroupList.includes(item.groupKey)) && 
            <div className='cursor-pointer flex items-center gap-x-3.5 w-[95%] pb-3.5 border-b border-black/[0.25] mb-3.5'>
                <div className='w-[20%]'>
                    <img src={item.photoURL? item.photoURL : ("./images/groupPhoto.png")} className='rounded-full w-[70px] h-[70px]'/>
                </div>
                <div className='w-[50%]'>
                    <h3 className='font-Poppins font-semibold text-lg'>{item.groupName}</h3>
                    {/* <p className='font-Poppins font-semibold font-medium text-ptag/[0.75] text-sm'>Hi Guys, Wassup!</p> */}
                </div>
            </div>
        )
        ))
    :
    (groupList.length==0?(
        <div className='h-full flex justify-center items-center'>
            <div >
                <h3 className='font-Poppins font-semibold text-2xl'>No Group Exist</h3>
            </div>
        </div>
    )
    :
    (groupList.map((item)=>(
        ((item.adminId==userdata.uid || membergroupList.includes(item.groupKey)) && 
            <div className='cursor-pointer flex items-center gap-x-3.5 w-[95%] pb-3.5 border-b border-black/[0.25] mb-3.5'>
                <div className='w-[20%]'>
                    <img src={item.photoURL? item.photoURL : ("./images/groupPhoto.png")} className='rounded-full w-[70px] h-[70px]'/>
                </div>
                <div className='w-[50%]'>
                    <h3 className='font-Poppins font-semibold text-lg'>{item.groupName}</h3>
                    {/* <p className='font-Poppins font-semibold font-medium text-ptag/[0.75] text-sm'>Hi Guys, Wassup!</p> */}
                </div>
            </div>
        )
        
    ))))
    
    }

    </div>

</div>





  )
}

export default ChatGroup