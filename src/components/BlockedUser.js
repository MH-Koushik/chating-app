import React, { useEffect, useState } from 'react'
import { getDatabase, ref, onValue,set, push, remove} from "firebase/database";
import { useSelector } from 'react-redux';
import {SlOptionsVertical} from 'react-icons/sl'

const BlockedUser = () => {

    let userdata=useSelector((state)=>state.userLoginInfo.userInfo)
    const db = getDatabase()
    let [blockList, setBlockList]= useState([]);

    useEffect(()=>{
        const userRef = ref(db, 'block');
        onValue(userRef, (snapshot) => {
            let blockarr=[]
            snapshot.forEach((item)=>{
                if(userdata.uid==item.val().blockbyID){
                    blockarr.push({...item.val(), blockKey: item.key });
                }
                
            })
            setBlockList(blockarr);
        });

    },[userdata])


    let handleUnBlock=(item)=>{
        remove(ref(db, 'block/'+item.blockKey));
    }











  return (
    <div className=' relative mt-[15px] w-full h-[447px] px-5 py-3.5 bg-white rounded-[20px] drop-shadow-lg '>
        <p className='font-Poppins font-semibold text-xl mb-4'>Blocked Users</p>
        <SlOptionsVertical className='absolute top-[20px] right-[20px] text-[19px] text-button cursor-pointer'/>

        <div className='overflow-y-auto h-[368px] scroll-smooth last:border-0'>  
            {blockList.map((item)=>(
                 <div className='flex items-center gap-x-3.5 w-[95%] pb-3.5 border-b border-black/[0.25] mb-3.5'>
                 <div className='w-[20%]'>
                     <img src={item.blockPhoto} className='rounded-full w-[70px] h-[70px]'/>
                 </div>
                 <div className='w-[50%]'>
                     <h3 className='font-Poppins font-semibold text-lg'>{item.blockName}</h3>
                     <p className='font-Poppins font-semibold font-medium text-ptag/[0.75] text-sm'>{item.blockMail}</p>
                 </div>
                 <div className='flex justify-end w-[30%]'>
                     <button onClick={()=>handleUnBlock(item)} className='px-[9px] py-[5px] bg-button font-semibold font-Poppins text-[20px] text-white rounded-[5px]'>UnBlock</button> 
                 </div>
             </div> 
            ))}     
           
        </div>

    </div>
  )
}

export default BlockedUser