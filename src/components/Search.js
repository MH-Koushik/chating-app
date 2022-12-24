import React from 'react'
import {FiSearch} from 'react-icons/fi'
import {SlOptionsVertical} from 'react-icons/sl'
const Search = () => {
  return (
    <div className='relative mt-[10px]'>
        <input type='text' placeholder='Search' className='  w-full h-[59px] px-16 py-4 drop-shadow-lg outline-0  rounded-[20px]'/>
        <FiSearch className='absolute top-[20px] left-[23px] text-[19px]'/>
        <SlOptionsVertical className='absolute top-[20px] right-[20px] text-[19px] text-button cursor-pointer'/>
    </div>
  )
}

export default Search