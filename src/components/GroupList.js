import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { showGroupCreate } from '../slices/creatGroupSlice';
import {FiSearch} from 'react-icons/fi'
import { getDatabase, ref, onValue,set, push, remove} from "firebase/database";

const GroupList = () => {
    let dispatch=useDispatch();
    let userdata=useSelector((state)=>state.userLoginInfo.userInfo)
    const db = getDatabase()
    let showCreateGroup = useSelector((state)=>state.creatGroupShow.showCreateGroup);
    let [groupList,setGroupList]=useState([])
    let [groupJoinReqarr,setGroupJoinReqarr]=useState([])
    let [memberGroupList,setMemberGroupList]=useState([]);

    let handleCreatGroup=()=>{
        dispatch(showGroupCreate(true))
    }

    
    useEffect(()=>{
        const groupMemberRef = ref(db, 'GroupMember');
        onValue(groupMemberRef, (snapshot) => {
            let membergrouparr=[]
            snapshot.forEach((item)=>{
                if(userdata.uid==item.val().memberID){
                    membergrouparr.push(item.val().memberID+item.val().groupID);
                }
            })
            setMemberGroupList(membergrouparr);
        });
    },[])


    useEffect(()=>{
        const groupRef = ref(db, 'group');
        onValue(groupRef, (snapshot) => {
            let grouparr=[]
            snapshot.forEach((item)=>{ 
                if(userdata.uid!=item.val().adminId){
                    grouparr.push({...item.val(), groupKey: item.key });
                }
            })
            setGroupList(grouparr);
        });
    },[])

    let handleJoinRequest=(item)=>{
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

    let handlegroupLeave=(item)=>{
        let removeKey
        const groupLeaveRef = ref(db, 'GroupMember');
        onValue(groupLeaveRef, (snapshot) => {
            snapshot.forEach((itemv)=>{ 
                if(item==itemv.val().groupID && userdata.uid==itemv.val().memberID){
                    removeKey=itemv.key
                }
            })
        });
        remove(ref(db, 'GroupMember/'+removeKey))
    }

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
        <button onClick={handleCreatGroup} className=' absolute top-[75px] right-[40px] text-[19px] text-white font-Poppins font-semibold text-[15px] text-white py-1.5 px-[10px] bg-button rounded-[5px]'>Creat Group</button>
        <div className='flex w-full mb-10'>
            <p className='w-2/5 font-Poppins font-semibold text-xl mt-3 '>Available Groups</p>
            <div className='w-3/5  relative'>
                <input onChange={handleSearch} type='text' placeholder='Search' className='  w-[100px]] h-[49px] px-12 py-4 drop-shadow-lg outline-0  rounded-[20px]'/>
                <FiSearch className='absolute top-[16px] left-[15px] text-[19px]'/>
            </div>
        </div>

        <div className='overflow-y-auto h-[276px] scroll-smooth'>

        {userSearchList.length>0?
            userSearchList.map((item)=>(
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
                        :memberGroupList.includes(userdata.uid+item.groupKey || item.groupKey+userdata.uid)?
                            <div>
                                <button onClick={()=>handlegroupLeave(item.groupKey )} className='px-[19px] py-[5px] bg-red-500 font-semibold font-Poppins text-[15px] text-white rounded-[5px]'>Leave</button>
                            </div>
                            
                        :
                            <button  onClick={()=>handleJoinRequest(item)} className='px-[22px] py-[5px] bg-button font-semibold font-Poppins text-[15px] text-white rounded-[5px]'>Join</button>
                        }
                        
                    </div>
                </div>
            </div> 
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
                    :memberGroupList.includes(userdata.uid+item.groupKey || item.groupKey+userdata.uid)?
                        <div>
                            <button onClick={()=>handlegroupLeave(item.groupKey )} className='px-[19px] py-[5px] bg-red-500 font-semibold font-Poppins text-[15px] text-white rounded-[5px]'>Leave</button>
                        </div>
                        
                    :
                        <button  onClick={()=>handleJoinRequest(item)} className='px-[22px] py-[5px] bg-button font-semibold font-Poppins text-[15px] text-white rounded-[5px]'>Join</button>
                    }
                    
                </div>
            </div>
        </div> 
        ))))
        
        }

        </div>

    </div>
  )
}

export default GroupList
