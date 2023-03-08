import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getAllMessagesByConversationId } from "../../services/patient/conversation";

export const messageSlice = createSlice({
    name: "messages",
    initialState: {
        messages: [],
        conversation_id_clicked: null,
    },
    reducers: {
        pushMessage: (state, action) => {
            state.messages.push(action.payload);
        },
    },
    extraReducers: (builder) => {
        builder.addCase(
            fetchMessagesByIdConversation.fulfilled,
            (state, action) => {
                state.messages = action.payload.messages;
                state.conversation_id_clicked = action.payload.conversation_id;
            }
        );
    },
});

export const fetchMessagesByIdConversation = createAsyncThunk(
    "messages/fetchMessagesByConversationId",
    async (id) => {
        const resp = await getAllMessagesByConversationId(id);
        if (resp?.data) {
            return {
                messages: resp.data,
                conversation_id: resp.data[0].conversation,
            };
        }
    }
);

export const { pushMessage } = messageSlice.actions;
export default messageSlice.reducer;
