import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { requestGroupKey, showGroupCreate, showRequestGroup } from '../slices/creatGroupSlice';
import { getDatabase, ref, onValue,set, push, remove} from "firebase/database";
import {SlOptionsVertical} from 'react-icons/sl'
const MyGroups = () => {

    let userdata=useSelector((state)=>state.userLoginInfo.userInfo)
    const db = getDatabase()
    let dispatch = useDispatch();
    let [myGroupList,setMyGroupList]=useState([]);

    useEffect(()=>{
        const groupRef = ref(db, 'group');
        onValue(groupRef, (snapshot) => {
            let grouparr=[]
            snapshot.forEach((item)=>{
                if(userdata.uid==item.val().adminId){ //for memeber check= || item.val().member.includes(userdata.uid)
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
        dispatch(showRequestGroup(true))
        dispatch(requestGroupKey(item))
    }
    






  return (
    <div className=' relative mt-[15px] w-full h-[447px] px-5 py-3.5 bg-white rounded-[20px] drop-shadow-lg '>
    <p className='font-Poppins font-semibold text-xl mb-4'>My Groups</p>
    <SlOptionsVertical className='absolute top-[20px] right-[20px] text-[19px] text-button cursor-pointer'/>

    <div className='overflow-y-auto h-[368px] scroll-smooth last:border-0'>  
        {myGroupList.length==0?(
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
                    <button  className='px-[10px] py-[5px] bg-button font-semibold font-Poppins text-[15px] text-white rounded-[5px] mb-[5px]'>Add Member</button>
                    {userdata.uid==item.adminId?
                    <div> 
                    <button onClick={()=>handleJoinRequest(item.groupKey)} className='px-[29px] py-[5px] bg-green-600 font-semibold font-Poppins text-[15px] text-white rounded-[5px] mb-[5px]'>Request</button>
                    <button onClick={()=>handleGroupDelete(item.groupKey)} className='px-[10px] py-[5px] bg-red-500 font-semibold font-Poppins text-[15px] text-white rounded-[5px] mb-[5px]'>Delete Group</button>
                    </div>
                        :
                    <button  className='px-[19px] py-[5px] bg-red-500 font-semibold font-Poppins text-[15px] text-white rounded-[5px]'>Leave</button>
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

export default MyGroups