import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {getAllConversation} from '../../../services/doctor/patient';

export const doctorConversationSlice = createSlice({
  name: 'doctor_conversations',
  initialState: {
    conversations: [],
  },
  reducers: {
    pushConversationAfterAcceptSchedule: (state, action) => {
      state.conversations.push(action.payload);
    },
  },
  extraReducers: builder => {
    builder.addCase(fetchConversationByDoctorId.fulfilled, (state, action) => {
      state.conversations = action.payload;
    });
  },
});

export const fetchConversationByDoctorId = createAsyncThunk(
  'doctor_conversations/fetchById',
  async id => {
    const resp = await getAllConversation(id);
    if (resp?.data) {
      const conversations = resp.data;
      // console.log(conversations);
      return conversations;
    }
  },
);

const {pushConversationAfterAcceptSchedule} = doctorConversationSlice.actions;

export default doctorConversationSlice.reducer;
