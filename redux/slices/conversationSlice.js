import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getAllConversationByPatientId } from "../../services/patient/conversation";

export const conversationSlice = createSlice({
    name: "conversations",
    initialState: {
        conversations: [],
    },
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(
            fetchConversationByPatientId.fulfilled,
            (state, action) => {
                state.conversations = action.payload;
            }
        );
    },
});

export const fetchConversationByPatientId = createAsyncThunk(
    "conversations/fetchById",
    async (id) => {
        const resp = await getAllConversationByPatientId(id);
        if (resp?.data) {
            const conversations = resp.data;
            return conversations;
        }
    }
);

export default conversationSlice.reducer;
