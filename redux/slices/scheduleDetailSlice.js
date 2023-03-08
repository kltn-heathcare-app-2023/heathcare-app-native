import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Alert } from "react-native";
import { getAllScheduleOfMe } from "../../services/patient/schedule_detail";

export const scheduleDetailSlice = createSlice({
    name: "schedule_details",
    initialState: { schedule_detail_list: [] },
    reducers: {
        pushScheduleDetail: (state, action) => {
            state.schedule_detail_list.push(action.payload);
        },
        removeScheduleDetail: (state, action) => {
            const schedule_detail_id = action.payload;
            const index = state.schedule_detail_list.findIndex(
                (schedule) => schedule._id === schedule_detail_id
            );

            state.schedule_detail_list.splice(index, 1);
        },
    },
    extraReducers: (builder) => {
        builder.addCase(
            fetchAllScheduleDetailListById.fulfilled,
            (state, action) => {
                state.schedule_detail_list = action.payload;
            }
        );
    },
});

export const { pushScheduleDetail, removeScheduleDetail } =
    scheduleDetailSlice.actions;

export const fetchAllScheduleDetailListById = createAsyncThunk(
    "schedule_details/fetchAllScheduleDetailListById",
    async (id) => {
        try {
            const resp = await getAllScheduleOfMe(id);
            if (resp?.data) {
                return resp.data;
            }
        } catch (error) {
            Alert.alert(TITLE_ERROR, error);
        }
    }
);

export default scheduleDetailSlice.reducer;
