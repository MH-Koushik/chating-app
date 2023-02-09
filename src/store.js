import { configureStore } from '@reduxjs/toolkit'
import userSlice from './slices/userSlice'
import creatGroupSlice from './slices/creatGroupSlice'
export default configureStore({
  reducer: {
    userLoginInfo: userSlice,
    creatGroupShow: creatGroupSlice,
  },
})