import {createSlice} from '@reduxjs/toolkit';

export const doctorInfoSlice = createSlice({
  name: 'doctor_info',
  initialState: {
    doctor_profile: {},
    doctor_info: {},
  },
  reducers: {},
  extraReducers: builder => {},
});

export default doctorInfoSlice.reducer;
