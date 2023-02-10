import { createSlice } from '@reduxjs/toolkit'

export const CreateGroupSLice = createSlice({
  name: 'createGroup',
  initialState: {
    showCreateGroup: false,
  },
  reducers: {
    showGroupCreate: (state , action) => {
      state.showCreateGroup = action.payload;
    },
  },
})

export const { showGroupCreate } = CreateGroupSLice.actions;

export default CreateGroupSLice.reducer;