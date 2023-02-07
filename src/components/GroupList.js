import React from 'react'
import {SlOptionsVertical} from 'react-icons/sl'

const GroupList = () => {
  return (
    <div className=' relative mt-[43px] w-full h-[347px] px-5 py-3.5 bg-white rounded-[20px] drop-shadow-lg '>
        <p className='font-Poppins font-semibold text-xl mb-4'>GroupList</p>
        <SlOptionsVertical className='absolute top-[20px] right-[20px] text-[19px] text-button cursor-pointer'/>

        <div className='overflow-y-auto h-[276px] scroll-smooth'>

            <div className='flex items-center w-[95%] pb-3.5 border-b border-black/[0.25] mb-3.5'>
                <div className='w-[20%]'>
                    <img src='./images/demoImg.png' className='rounded-full w-[70px] h-[70px]'/>
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
