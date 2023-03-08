import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
    getBMIById,
    getIn4,
    getLastGlycemicById,
} from "../../services/patient/info";

export const infoSlice = createSlice({
    name: "info",
    initialState: {
        user_info: {},
        bmi_list: [],
        bmi_avg: 0,
        glycemic_last: 0,
        rule: "",
    },
    reducers: {
        updateAVGBMI: (state, action) => {
            state.bmi_avg = action.payload;
        },
        addBMI: (state, action) => {
            state.bmi_list.push(action.payload);
        },
        resetUserInfo: (state) => {
            state.user_info = {};
            state.bmi_list = [];
            state.bmi_avg = 0;
            state.glycemic_last = 0;
            state.rule = "";
        },
    },
    extraReducers: (builder) => {
        builder.addCase(fetchUserInfo.fulfilled, (state, action) => {
            state.user_info = action.payload.user;
            state.bmi_avg = action.payload.bmis.avgBMI ?? 0;
            state.bmi_list = action.payload.bmis.bmis;
            state.glycemic_last = action.payload.glycemic;
            state.rule = action.payload.bmis.rule.notification;
        });
    },
});

export const fetchUserInfo = createAsyncThunk("info/fetchInfo", async () => {
    try {
        const resp = await getIn4();
        const user = resp.data;

        if (user) {
            const user_id = user._id;
            const resp_values = await Promise.all([
                getBMIById(user_id),
                getLastGlycemicById(user_id),
            ]);

            const bmis = resp_values[0].data;
            const glycemic = resp_values[1].data;

            return {
                user,
                bmis,
                glycemic,
            };
        }
    } catch (error) {
        console.error("error in fetch user", error);
    }
});

export const { updateAVGBMI, addBMI, resetUserInfo } = infoSlice.actions;

export default infoSlice.reducer;
