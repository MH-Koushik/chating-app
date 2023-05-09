import { createSlice } from '@reduxjs/toolkit'

export const CreateGroupSLice = createSlice({
  name: 'createGroup',
  initialState: {
    showCreateGroup: false,
    showGroupJoinRequest: false,
    grouprequestKey: false,
    showGroupMember: false,
    groupmemberKey: false,
    addMemberKey: false,
    addMembershow: false,
    addMemberNameGroup: "",
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
    groupMemberShow: (state , action) => {
      state.showGroupMember = action.payload;
    },
    groupMemberShowKey: (state , action) => {
      state.groupmemberKey = action.payload;
    },
    addMemberGroupKey: (state , action) => {
      state.addMemberKey = action.payload;
    },
    addMemberGroupShow: (state , action) => {
      state.addMembershow = action.payload;
    },
    addMemberGroupName: (state , action) => {
      state.addMemberNameGroup = action.payload;
    },
  },
})

export const { showGroupCreate,showRequestGroup,requestGroupKey,groupMemberShowKey,groupMemberShow,addMemberGroupKey,addMemberGroupShow,addMemberGroupName } = CreateGroupSLice.actions;

export default CreateGroupSLice.reducer;