import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { showGroupCreate } from '../slices/creatGroupSlice';
import { getDatabase, ref, onValue,set, push, remove} from "firebase/database";
import {SlOptionsVertical} from 'react-icons/sl'

const GroupList = () => {
    let dispatch=useDispatch();
    let userdata=useSelector((state)=>state.userLoginInfo.userInfo)
    const db = getDatabase()
    let showCreateGroup = useSelector((state)=>state.creatGroupShow.showCreateGroup);
    let [groupList,setGroupList]=useState([])
    let [groupJoinReqarr,setGroupJoinReqarr]=useState([])

    let handleCreatGroup=()=>{
        dispatch(showGroupCreate(true))
    }

    useEffect(()=>{
        const groupRef = ref(db, 'group');
        onValue(groupRef, (snapshot) => {
            let grouparr=[]
            snapshot.forEach((item)=>{ 
                if(userdata.uid!=item.val().adminId){  //for memeber check= || item.val().member.indexOf(userdata.uid)===-1
                    grouparr.push({...item.val(), groupKey: item.key });
                }
                
            })
            setGroupList(grouparr);
        });
    },[])

    let handleJoinRequest=(item)=>{
        console.log(item)
        set(push(ref(db, 'GroupJoinRequest')), {
            senderID: userdata.uid,
            senderName: userdata.displayName,
            senderPhotoURL: userdata.photoURL,
            groupID: item.groupKey,
            groupAdminID: item.adminId,
            groupName: item.groupName,
          });
    }

    useEffect(()=>{
        const groupJoinRef = ref(db, 'GroupJoinRequest');
        onValue(groupJoinRef, (snapshot) => {
            let groupJoinarr=[]
            snapshot.forEach((item)=>{ 
                groupJoinarr.push(item.val().senderID+item.val().groupID);
            })
            setGroupJoinReqarr(groupJoinarr);
        });
    },[])


  return (
    <div className=' relative mt-[43px] w-full h-[347px] px-5 py-3.5 bg-white rounded-[20px] drop-shadow-lg '>
        <p className='font-Poppins font-semibold text-xl mb-4'>Available Groups</p>
        <button onClick={handleCreatGroup} className=' absolute top-[20px] right-[40px] text-[19px] text-button font-Poppins font-semibold text-[15px] text-white py-1.5 px-[10px] bg-button rounded-[5px]'>Creat Group</button>

        <div className='overflow-y-auto h-[276px] scroll-smooth'>

        {groupList.length==0?(
            <div className='h-full flex justify-center items-center'>
                <div >
                    <h3 className='font-Poppins font-semibold text-2xl'>No Group Exist</h3>
                </div>
            </div>
        )
        :
        (groupList.map((item)=>(
            <div className='flex items-center gap-x-3.5 w-[95%] pb-3.5 border-b border-black/[0.25] mb-3.5'>
            <div className='w-[20%]'>
                <img src={item.photoURL? item.photoURL : ("./images/groupPhoto.png")} className='rounded-full w-[70px] h-[70px]'/>
            </div>
            <div className='w-[50%]'>
                <h3 className='font-Poppins font-semibold text-lg'>{item.groupName}</h3>
                {/* <p className='font-Poppins font-semibold font-medium text-ptag/[0.75] text-sm'>Hi Guys, Wassup!</p> */}
            </div>
            <div className='flex justify-end w-[30%]'>
                <div className='text-center'>
                    {groupJoinReqarr.includes(userdata.uid+item.groupKey || item.groupKey+userdata.uid)?
                        <button  className='px-[22px] py-[5px] bg-green-600 font-semibold font-Poppins text-[15px] text-white rounded-[5px]'>PENDING</button>
                    :
                        <button  onClick={()=>handleJoinRequest(item)} className='px-[22px] py-[5px] bg-button font-semibold font-Poppins text-[15px] text-white rounded-[5px]'>Join</button>
                    }
                    
                </div>
            </div>
        </div> 
        )))
        }

        </div>

    </div>
  )
}

export default GroupList
