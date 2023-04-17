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
    updateLastMessage: (state, action) => {
      console.log('message update -> ', action.payload);
      const conversation = state.conversations.find(
        conversation => conversation._id === action.payload.conversation,
      );
      const conversation_updated = {
        ...conversation,
        last_message: action.payload,
      };
      const index = state.conversations.findIndex(
        conversation => conversation._id === action.payload.conversation,
      );
      if (index > -1) {
        state.conversations.splice(index, 1);
        state.conversations.unshift(conversation_updated);
      }
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

const {pushConversationAfterAcceptSchedule, updateLastMessage} =
  doctorConversationSlice.actions;

export default doctorConversationSlice.reducer;
