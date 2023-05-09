import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { requestGroupKey, showGroupCreate, showRequestGroup } from '../slices/creatGroupSlice';
import { getDatabase,ref, onValue,set, push, update,remove} from "firebase/database";

const GroupJoinRequest = () => {

    const db = getDatabase();
    let dispatch = useDispatch();
    let userdata=useSelector((state)=>state.userLoginInfo.userInfo)
    let [requestList,setRequestList]=useState([])

    let GroupKey= useSelector((state)=>state.creatGroupShow.grouprequestKey)


    useEffect(()=>{
        const groupJoinRef = ref(db, 'GroupJoinRequest');
        onValue(groupJoinRef, (snapshot) => {
            let groupJoinarr=[]
            snapshot.forEach((item)=>{ 
                if(item.val().groupID==GroupKey){
                    groupJoinarr.push({...item.val(), joinRequestKey: item.key});
                }
            })
            setRequestList(groupJoinarr);
        });


    },[])

    let handleRequestClose=()=>{
        dispatch(showRequestGroup(false))
        dispatch(requestGroupKey(false))
    }
    let handleGroupJoinReject=(item)=>{
        remove(ref(db, 'GroupJoinRequest/'+item))
    }






  return (

    <div className=' absolute w-full h-full bg-black/[.50] z-50 flex justify-center items-center drop-shadow-2xl '>
        <div className='w-2/4 bg-white rounded-lg p-4 '>

          <div>
              <h3 className='text-nunito text-heading text-3xl font-bold mb-[15px] text-center'>Request List</h3>
              <div className='flex justify-center mb-[15px]'>

                <div className=' relative mt-[10px] w-7/12 h-[447px] px-5 py-3.5 bg-white rounded-[20px] drop-shadow-lg' >
                  <p className='font-Poppins font-semibold text-xl mb-4 text-center'>Request List</p>
                
                  <div className='overflow-y-auto h-[367px] scroll-smooth'>
                      {requestList.map((item)=>(
                           <div className='flex items-center w-[95%] pb-3.5 border-b border-black/[0.25] mb-3.5'>
                           <div className='w-[20%]'>
                               <img src={item.senderPhotoURL} className='rounded-full w-[70px] h-[70px]'/>
                           </div>
                           <div className='w-[60%] ml-[14px]'>
                               <h3 className='font-Poppins font-semibold text-lg'>{item.senderName}</h3>
                           </div>
                           <div className='flex justify-end w-[15%]'>
                                <div>
                                    <button  className='px-[37px] py-[5px] bg-green-600 font-semibold font-Poppins text-[15px] text-white rounded-[5px] mb-[5px]'>Add</button>
                                    <button onClick={()=>handleGroupJoinReject(item.joinRequestKey)}  className='px-[29px] py-[5px] bg-red-600 font-semibold font-Poppins text-[15px] text-white rounded-[5px] mb-[5px]'>Reject</button>
                                </div>
                               
                           </div>
                       </div> 
                      ))}
                  </div>

                </div>
              </div>
              <div className='flex justify-center'>
                <button onClick={handleRequestClose}  className=' text-nunito px-6 py-2 rounded-lg bg-button mt-2 text-white text-2xl font-bold mr-4 border-2 border-button'>Done </button>
              </div>
            </div>

        </div>

    </div>












  )
}

export default GroupJoinRequest