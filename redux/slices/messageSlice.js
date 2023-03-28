import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {getAllMessagesByConversationId} from '../../services/patient/conversation';

export const messageSlice = createSlice({
  name: 'messages',
  initialState: {
    messages: [],
    conversation_id_clicked: null,
  },
  reducers: {
    pushMessage: (state, action) => {
      const isExist = state.messages.findIndex(
        message => message._id === action.payload._id,
      );

      if (isExist < 0) {
        state.messages.push(action.payload);
      }
    },
  },
  extraReducers: builder => {
    builder.addCase(
      fetchMessagesByIdConversation.fulfilled,
      (state, action) => {
        state.messages = action.payload.messages;
        state.conversation_id_clicked = action.payload.conversation_id;
      },
    );
  },
});

export const fetchMessagesByIdConversation = createAsyncThunk(
  'messages/fetchMessagesByConversationId',
  async id => {
    const resp = await getAllMessagesByConversationId(id);
    if (resp?.data && resp?.data.length > 0) {
      return {
        messages: resp.data,
        conversation_id: resp.data[0].conversation,
      };
    }
    return {
      messages: [],
      conversation_id: id,
    };
  },
);

export const {pushMessage} = messageSlice.actions;
export default messageSlice.reducer;
