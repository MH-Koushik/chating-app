import React, { useEffect, useState } from 'react'
import {FiSearch} from 'react-icons/fi'
import { getDatabase, ref, onValue,set, push, remove} from "firebase/database";
import { useSelector } from 'react-redux';
import {SlOptionsVertical} from 'react-icons/sl'

const BlockedUser = () => {

    let userdata=useSelector((state)=>state.userLoginInfo.userInfo);
    const db = getDatabase();
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
        remove(ref(db, 'block/'+item));
    }

    let[userSearchList, setUserSearchList]=useState([])
    let handleSearch=(e)=>{
        console.log(e.target.value)
        let arr=[]
        if(e.target.value.length==0){
            setUserSearchList([])
        }else{
            blockList.map((item)=>{
                if(item.username.toLowerCase().includes(e.target.value.toLowerCase())){
                    arr.push(item)
                }
            })
            setUserSearchList(arr)
        }
    }
    









  return (
    <div className=' relative mt-[15px] w-full h-[447px] px-5 py-3.5 bg-white rounded-[20px] drop-shadow-lg '>
        <div className='flex w-full mb-4'>
            <p className='w-2/5 font-Poppins font-semibold text-xl mt-3 '>Blocked Users</p>
            <div className='w-3/5  relative'>
                <input onChange={handleSearch} type='text' placeholder='Search' className='  w-[100px]] h-[49px] px-12 py-4 drop-shadow-lg outline-0  rounded-[20px]'/>
                <FiSearch className='absolute top-[16px] left-[15px] text-[19px]'/>
            </div>
        </div>

        <div className='overflow-y-auto h-[368px] scroll-smooth last:border-0'>  
            {blockList.length==0?
                <div className='h-full flex justify-center items-center'>
                    <div>
                        <h3 className='font-Poppins font-semibold text-2xl'>No Blocked User Exist</h3>
                    </div>
                </div>
            :
            (blockList.map((item)=>(
                 <div className='flex items-center gap-x-3.5 w-[95%] pb-3.5 border-b border-black/[0.25] mb-3.5'>
                 <div className='w-[20%]'>
                     <img src={item.blockPhoto} className='rounded-full w-[70px] h-[70px]'/>
                 </div>
                 <div className='w-[50%]'>
                     <h3 className='font-Poppins font-semibold text-lg'>{item.blockName}</h3>
                     <p className='font-Poppins font-semibold font-medium text-ptag/[0.75] text-sm'>{item.blockMail}</p>
                 </div>
                 <div className='flex justify-end w-[30%]'>
                     <button onClick={()=>handleUnBlock(item.blockKey)} className='px-[9px] py-[5px] bg-button font-semibold font-Poppins text-[20px] text-white rounded-[5px]'>UnBlock</button> 
                 </div>
             </div> 
            )))}     
           
        </div>

    </div>
  )
}

export default BlockedUser