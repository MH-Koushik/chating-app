
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
import GroupJoinRequest from '../../components/GroupJoinRequest';
import GroupMemberView from '../../components/GroupMemberView';
import AddGroupMember from '../../components/AddGroupMember';
const ChatPage = () => {
    const auth = getAuth();
    const dispatch=useDispatch();
    const navigate = useNavigate();
    let[verified,setVerified]=useState(true)
    let data = useSelector((state)=>state.userLoginInfo.userInfo)







  return (
    <>
    {data&&
        <div className='flex w-full'>
          <Sidebar Active="msg"/>
          {verified?
            <>
              <div className='flex w-full justify-evenly bg-white'>
                <div className='w-[30%] '>
                    <GroupList/>
                    <Friend/>
                </div>
                <div className='w-[30%] '>

                </div>
                <div className='w-[30%] '>

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

export default ChatPage