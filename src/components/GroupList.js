import React from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { showGroupCreate } from '../slices/creatGroupSlice';

const GroupList = () => {
    let dispatch=useDispatch();
    let showCreateGroup = useSelector((state)=>state.creatGroupShow.showCreateGroup);
    let handleCreatGroup=()=>{
        dispatch(showGroupCreate(true))
    }
 
  return (
    <div className=' relative mt-[43px] w-full h-[347px] px-5 py-3.5 bg-white rounded-[20px] drop-shadow-lg '>
        <p className='font-Poppins font-semibold text-xl mb-4'>GroupList</p>
        <button onClick={handleCreatGroup} className=' absolute top-[20px] right-[40px] text-[19px] text-button font-Poppins font-semibold text-[15px] text-white py-1.5 px-[10px] bg-button rounded-[5px]'>Creat Group</button>

        <div className='overflow-y-auto h-[276px] scroll-smooth'>

            <div className='flex items-center w-[95%] pb-3.5 border-b border-black/[0.25] mb-3.5'>
                <div className='w-[20%]'>
                    <img src='./images/groupPhoto.png' className='rounded-full w-[70px] h-[70px]'/>
                </div>
                <div className='w-[60%] ml-[14px]'>
                    <h3 className='font-Poppins font-semibold text-lg'>Friends Reunion</h3>
                    <p className='font-Poppins font-semibold font-medium text-ptag/[0.75] text-sm'>Hi Guys, Wassup!</p>
                </div>
                <div className='flex justify-end w-[15%]'>
                    <button className='font-Poppins font-semibold text-[20px] text-white py-2 px-[22px] bg-button rounded-[5px]'>Join</button>  
                </div>
            </div> 
        </div>

    </div>
  )
}

export default GroupList
