import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {getAllSchedules} from '../../services/schedules';

export const scheduleSlice = createSlice({
  name: 'schedules',
  initialState: {schedule_list: [], day_of_week: new Date().getDay()},
  reducers: {
    chooseDayOfWeek: (state, action) => {
      // console.log(action.payload);
      state.day_of_week = action.payload;
    },
  },
  extraReducers: builder => {
    builder.addCase(fetchAllScheduleDoctor.fulfilled, (state, action) => {
      state.schedule_list = action.payload;
    });
  },
});

export const {chooseDayOfWeek} = scheduleSlice.actions;
export const fetchAllScheduleDoctor = createAsyncThunk(
  'schedules/fetchAllScheduleDoctor',
  async () => {
    const resp = await getAllSchedules();
    const schedules = resp.data;
    return schedules;
  },
);

export default scheduleSlice.reducer;
