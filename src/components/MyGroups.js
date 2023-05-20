import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import {FiSearch} from 'react-icons/fi'
import { addMemberGroupKey, addMemberGroupName, addMemberGroupShow, groupMemberShow, groupMemberShowKey, requestGroupKey, showGroupCreate, showRequestGroup } from '../slices/creatGroupSlice';
import { getDatabase, ref, onValue,set, push, remove} from "firebase/database";
import {SlOptionsVertical} from 'react-icons/sl'
const MyGroups = () => {

    let userdata=useSelector((state)=>state.userLoginInfo.userInfo)
    const db = getDatabase()
    let dispatch = useDispatch();
    let [myGroupList,setMyGroupList]=useState([]);

    // ---------Memeber check only works on My group list not on group list--------------

    // let [memberGroupList,setMemberGroupList]=useState([]);

    
    // useEffect(()=>{
    //     const groupMemberRef = ref(db, 'GroupMember');
    //     onValue(groupMemberRef, (snapshot) => {
    //         let membergrouparr=[]
    //         snapshot.forEach((item)=>{
    //             if(userdata.uid==item.val().memberID){
    //                 membergrouparr.push(item.val().groupID);
    //             }
    //         })
    //         setMemberGroupList(membergrouparr);
    //     });
    // },[])

    // useEffect(()=>{
    //     const groupRef = ref(db, 'group');
    //     onValue(groupRef, (snapshot) => {
    //         let grouparr=[]
    //         snapshot.forEach((item)=>{
    //             if(userdata.uid==item.val().adminId || memberGroupList.includes(item.key)){ 
    //                 grouparr.push({...item.val(), groupKey: item.key });
    //             }
    //         })
    //         setMyGroupList(grouparr);
    //     });
    // },[memberGroupList])

    // ---------Memeber check only works on My group list not on group list--------------


    useEffect(()=>{
        const groupRef = ref(db, 'group');
        onValue(groupRef, (snapshot) => {
            let grouparr=[]
            snapshot.forEach((item)=>{
                if(userdata.uid==item.val().adminId ){ 
                    grouparr.push({...item.val(), groupKey: item.key });
                }
            })
            setMyGroupList(grouparr);
        });
    },[])



    let handleGroupDelete=(e)=>{
        remove(ref(db, 'group/'+e))
    }

    let handleJoinRequest=(item)=>{
        dispatch(requestGroupKey(item))
        dispatch(showRequestGroup(true))
    }


    let handleMememberView=(item)=>{
        dispatch(groupMemberShowKey(item))
        dispatch(groupMemberShow(true))
    }

    let handleAddMember=(item)=>{
        dispatch(addMemberGroupKey(item.groupKey))
        dispatch(addMemberGroupShow(true))
        dispatch(addMemberGroupName(item.groupName))
    }

    let[userSearchList, setUserSearchList]=useState([])

    let handleSearch=(e)=>{
        console.log(e.target.value)
        let arr=[]
        if(e.target.value.length==0){
            setUserSearchList([])
        }else{
            myGroupList.map((item)=>{
                if(item.groupName.toLowerCase().includes(e.target.value.toLowerCase())){
                    arr.push(item)
                }
            })
            setUserSearchList(arr)
        }
    }
    



  return (
    <div className=' relative mt-[15px] w-full h-[447px] px-5 py-3.5 bg-white rounded-[20px] drop-shadow-lg '>
        <div className='flex w-full mb-4'>
            <p className='w-2/5 font-Poppins font-semibold text-xl mt-3 '>MY Groups</p>
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
                    <img src={item.photoURL? item.photoURL : ("./images/groupPhoto.png")} className='rounded-full w-[70px] h-[70px]'/>
                </div>
                <div className='w-[50%]'>
                    <h3 className='font-Poppins font-semibold text-lg'>{item.groupName}</h3>
                    {/* <p className='font-Poppins font-semibold font-medium text-ptag/[0.75] text-sm'>Hi Guys, Wassup!</p> */}
                </div>
                <div className='flex justify-end w-[30%]'>
                    <div className='text-center'>
                        <button onClick={()=>handleMememberView(item.groupKey)} className='px-[16px] py-[5px] bg-button font-semibold font-Poppins text-[15px] text-white rounded-[5px] mb-[5px]'>Member List</button>
                        <button onClick={()=>handleAddMember(item)}  className='px-[10px] py-[5px] bg-button font-semibold font-Poppins text-[15px] text-white rounded-[5px] mb-[5px]'>Add Members</button>
                        <button onClick={()=>handleJoinRequest(item.groupKey)} className='px-[29px] py-[5px] bg-green-600 font-semibold font-Poppins text-[15px] text-white rounded-[5px] mb-[5px]'>Requests</button>
                        <button onClick={()=>handleGroupDelete(item.groupKey)} className='px-[14px] py-[5px] bg-red-500 font-semibold font-Poppins text-[15px] text-white rounded-[5px] mb-[5px]'>Delete Group</button>
                        
                    </div>
                </div>
            </div> 
            ))
        :
            (
                myGroupList.length==0?(
                    <div className='h-full flex justify-center items-center'>
                        <div >
                            <h3 className='font-Poppins font-semibold text-2xl'>No Group Exist</h3>
                        </div>
                    </div>
                )
                :
                (myGroupList.map((item)=>(
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
                            <button onClick={()=>handleMememberView(item.groupKey)} className='px-[16px] py-[5px] bg-button font-semibold font-Poppins text-[15px] text-white rounded-[5px] mb-[5px]'>Member List</button>
                            <button onClick={()=>handleAddMember(item)}  className='px-[10px] py-[5px] bg-button font-semibold font-Poppins text-[15px] text-white rounded-[5px] mb-[5px]'>Add Members</button>
                            <button onClick={()=>handleJoinRequest(item.groupKey)} className='px-[29px] py-[5px] bg-green-600 font-semibold font-Poppins text-[15px] text-white rounded-[5px] mb-[5px]'>Requests</button>
                            <button onClick={()=>handleGroupDelete(item.groupKey)} className='px-[14px] py-[5px] bg-red-500 font-semibold font-Poppins text-[15px] text-white rounded-[5px] mb-[5px]'>Delete Group</button>
                            
                        </div>
                    </div>
                </div> 
                ))) 
            )
        }

        
    </div>

</div>
  )
}

export default MyGroups