import { createSlice } from '@reduxjs/toolkit'

export const userSlice = createSlice({
  name: 'user',
  initialState: {
    userInfo: localStorage.getItem("userInfo")? JSON.parse(localStorage.getItem("userInfo")): false,
  },
  reducers: {
    userLoginInfo: (state , action) => {
      state.userInfo = action.payload
    },
  },
})

export const { userLoginInfo } = userSlice.actions;

export default userSlice.reducer;