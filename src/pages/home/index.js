import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import BlockedUser from '../../components/BlockedUser';
import Friend from '../../components/Friend';
import FriendRequest from '../../components/FriendRequest';
import GroupList from '../../components/GroupList';
import MyGroups from '../../components/MyGroups';
import Search from '../../components/Search';
import Sidebar from '../../components/Sidebar';
import UserList from '../../components/UserList';
import CreateGroup from '../../components/CreatGroup';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { userLoginInfo } from '../../slices/userSlice';
const Home = ()=>{
  const auth = getAuth();
  const dispatch=useDispatch();
  const navigate = useNavigate();
  let[verified,setVerified]=useState(true)
  
  onAuthStateChanged(auth, (data)=>{
    if(!data.emailVerified){
      setVerified(false)
    }
    dispatch(userLoginInfo(data))
    localStorage.setItem("userInfo", JSON.stringify(data))
  })

  let showCreateGroup= useSelector((state)=>state.creatGroupShow.showCreateGroup)
  
  
  let data = useSelector((state)=>state.userLoginInfo.userInfo)
  useEffect(()=>{
    if(!data){
      navigate("/login")
    }
  },[])
  return (
    <>
    {data&&
        <div className='flex w-full'>
          <Sidebar/>
          
          {showCreateGroup && <CreateGroup/>}

          {verified?
            <>
              <div className='flex w-full justify-evenly bg-white'>
                <div className='w-[30%] '>
                  <Search/>
                  <GroupList/>
                  <FriendRequest/>
                </div>
                <div className='w-[30%] '>
                  <Friend/>
                  <MyGroups/>
                </div>
                <div className='w-[30%] '>
                  <UserList/>
                  <BlockedUser/>
                </div>
              </div>
              </>
              :
              <div className='w-full h-screen bg-white flex justify-center items-center'>
                <h2 className='font-Poppins font-semibold text-[40px] text-black'>Please Verify You Email</h2>
              </div> }
        </div>











      }
    </>
  )
}

export default Home