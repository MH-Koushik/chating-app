import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import {addMemberGroupKey, addMemberGroupName, addMemberGroupShow, groupMemberShow, groupMemberShowKey, requestGroupKey, showGroupCreate, showRequestGroup } from '../slices/creatGroupSlice';
import { getDatabase,ref, onValue,set, push, update,remove} from "firebase/database";



const AddGroupMember = () => {
    let[userList, setUserList]=useState([]);
    let [memberGroupList,setMemberGroupList]=useState([]);
    let dispatch = useDispatch();
    const db = getDatabase();
    let userdata=useSelector((state)=>state.userLoginInfo.userInfo)
    let addGroupKey= useSelector((state)=>state.creatGroupShow.addMemberKey)
    let addGroupName= useSelector((state)=>state.creatGroupShow.addMemberNameGroup)



    // let showAddGroupMember= useSelector((state)=>state.creatGroupShow.addMembershow)

    // if(showAddGroupMember){
    //     const userRef = ref(db, 'users');
    //     onValue(userRef, (snapshot) => {
    //         let userarr=[]
    //         snapshot.forEach((item)=>{
    //             if(userdata.uid != item.key){
    //                 userarr.push({...item.val(), userId: item.key})
    //             }
    //         })
    //         setUserList(userarr)
    //     });
    // }

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
    },[])

    useEffect(()=>{
        const groupMemberRef = ref(db, 'GroupMember');
        onValue(groupMemberRef, (snapshot) => {
            let membergrouparr=[]
            snapshot.forEach((item)=>{
                if(userdata.uid==item.val().adminID && addGroupKey==item.val().groupID){
                    membergrouparr.push(item.val().memberID+item.val().groupID);
                }
            })
            setMemberGroupList(membergrouparr);
        });
    },[])


    let handleAddMember=(item)=>{
        set(push(ref(db, 'GroupMember')), {
            groupID: addGroupKey,
            groupName: addGroupName,
            adminID: userdata.uid,
            memberID: item.userId,
            memberName: item.username,
            memberPhotoURL: item.photoURL,
          })
    }

    let handleAddMemberClose=()=>{
        dispatch(addMemberGroupKey(false))
        dispatch(addMemberGroupShow(false))
        dispatch(addMemberGroupName(false))
    }






  return (

<div className=' absolute w-full h-full bg-black/[.50] z-50 flex justify-center items-center drop-shadow-2xl '>
        <div className='w-2/4 bg-white rounded-lg p-4 '>
        <div>
              <h3 className='text-nunito text-heading text-3xl font-bold mb-[15px] text-center'>Add Member</h3>
              <div className='flex justify-center mb-[15px]'>

                <div className=' relative mt-[10px] w-7/12 h-[447px] px-5 py-3.5 bg-white rounded-[20px] drop-shadow-lg' >
                  <p className='font-Poppins font-semibold text-xl mb-4 text-center'>User List</p>
                
                  <div className='overflow-y-auto h-[367px] scroll-smooth'>
                      {userList.map((item)=>(
                        
                           <div className='flex items-center w-[95%] pb-3.5 border-b border-black/[0.25] mb-3.5'>
                           <div className='w-[20%]'>
                               <img src={item.photoURL} className='rounded-full w-[70px] h-[70px]'/>
                           </div>
                           <div className='w-[60%] ml-[14px]'>
                               <h3 className='font-Poppins font-semibold text-lg'>{item.username}</h3>
                               <p className='font-Poppins font-semibold font-medium text-ptag/[0.75] text-sm'>{item.email}</p>
                           </div>
                           <div className='flex justify-end w-[15%]'>
                           {memberGroupList.includes(item.userId+addGroupKey || addGroupKey+item.userId)?
                                <div></div>
                              :
                               <button onClick={(e)=>handleAddMember(item)} className='font-Poppins font-semibold text-[20px] text-white py-2 px-[22px] bg-button rounded-[5px]'>Add</button>
                           }


                           </div>
                       </div> 
                      ))}
                   

                  </div>

                </div>
              </div>
              <div className='flex justify-center'>
                <button onClick={handleAddMemberClose} className=' text-nunito px-6 py-2 rounded-lg bg-button mt-4 text-white text-2xl font-bold mr-4 border-2 border-button'>Done </button>
              </div>
            </div>



        </div>

    </div>


















  )
}

export default AddGroupMember