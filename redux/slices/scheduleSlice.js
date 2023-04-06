import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {
  getAllScheduleDetailsAfterNow,
  getAllSchedules,
} from '../../services/schedules';

export const scheduleSlice = createSlice({
  name: 'schedules',
  initialState: {
    schedule_list: [],
    schedule_details_after_now: [],
    day_of_week: new Date(),
  },
  reducers: {
    chooseDayOfWeek: (state, action) => {
      // console.log(action.payload);
      state.day_of_week = action.payload;
    },
  },
  extraReducers: builder => {
    builder.addCase(fetchAllScheduleDoctor.fulfilled, (state, action) => {
      state.schedule_list = action.payload.schedules;
      state.schedule_details_after_now =
        action.payload.schedule_details_after_now;
    });
  },
});

export const {chooseDayOfWeek} = scheduleSlice.actions;
export const fetchAllScheduleDoctor = createAsyncThunk(
  'schedules/fetchAllScheduleDoctor',
  async () => {
    try {
      const values = await Promise.all([
        getAllSchedules(),
        getAllScheduleDetailsAfterNow(),
      ]);

      return {
        schedules: values[0].data,
        schedule_details_after_now: values[1].data,
      };
    } catch (error) {
      console.error('error fetch schedule ->', error);
      return {
        schedules: [],
        schedule_details_after_now: [],
      };
    }
  },
);

export default scheduleSlice.reducer;
