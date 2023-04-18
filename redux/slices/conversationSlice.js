import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {getAllConversationByPatientId} from '../../services/patient/conversation';

export const conversationSlice = createSlice({
  name: 'conversations',
  initialState: {
    conversations: [],
  },
  reducers: {
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
    builder.addCase(fetchConversationByPatientId.fulfilled, (state, action) => {
      state.conversations = action.payload;
    });
  },
});

export const fetchConversationByPatientId = createAsyncThunk(
  'conversations/fetchById',
  async id => {
    const resp = await getAllConversationByPatientId(id);
    if (resp?.data) {
      const conversations = resp.data;
      return conversations;
    }
  },
);

const {updateLastMessage} = conversationSlice.actions;
export default conversationSlice.reducer;
