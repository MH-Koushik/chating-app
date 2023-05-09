import { createSlice } from '@reduxjs/toolkit'

export const CreateGroupSLice = createSlice({
  name: 'createGroup',
  initialState: {
    showCreateGroup: false,
    showGroupJoinRequest: false,
    grouprequestKey: false,
  },
  reducers: {
    showGroupCreate: (state , action) => {
      state.showCreateGroup = action.payload;
    },
    showRequestGroup: (state , action) => {
      state.showGroupJoinRequest = action.payload;
    },
    requestGroupKey: (state , action) => {
      state.grouprequestKey = action.payload;
    },
  },
})

export const { showGroupCreate,showRequestGroup,requestGroupKey } = CreateGroupSLice.actions;

export default CreateGroupSLice.reducer;