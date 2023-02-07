import React from 'react'
import {SlOptionsVertical} from 'react-icons/sl'
const MyGroups = () => {
  return (
    <div className=' relative mt-[15px] w-full h-[447px] px-5 py-3.5 bg-white rounded-[20px] drop-shadow-lg '>
    <p className='font-Poppins font-semibold text-xl mb-4'>My Groups</p>
    <SlOptionsVertical className='absolute top-[20px] right-[20px] text-[19px] text-button cursor-pointer'/>

    <div className='overflow-y-auto h-[368px] scroll-smooth last:border-0'>       
        <div className='flex items-center gap-x-3.5 w-[95%] pb-3.5 border-b border-black/[0.25] mb-3.5'>
            <div className='w-[20%]'>
                <img src='./images/demoImg.png' className='rounded-full w-[70px] h-[70px]'/>
            </div>
            <div className='w-[50%]'>
                <h3 className='font-Poppins font-semibold text-lg'>Friends Reunion</h3>
                <p className='font-Poppins font-semibold font-medium text-ptag/[0.75] text-sm'>Hi Guys, Wassup!</p>
            </div>
            <div className='flex justify-end w-[30%]'>
                <p className='font-Poppins font-medium font-medium text-ptag/[0.75] text-[10px]'>Today, 8:56pm</p> 
            </div>
        </div> 
        
    </div>

</div>
  )
}

export default MyGroups