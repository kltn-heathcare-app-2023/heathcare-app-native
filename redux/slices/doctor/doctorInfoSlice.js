import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {getDoctorProfile} from '../../../services/doctor/profile';

export const doctorInfoSlice = createSlice({
  name: 'doctor_info',
  initialState: {
    doctor_profile: {},
  },
  reducers: {},
  extraReducers: builder => {},
});

export const fetchInfoDoctor = createAsyncThunk(
  'fetch/doctor/info',
  async () => {
    try {
      const profile = await getDoctorProfile();
      console.log(profile);
    } catch (error) {
      console.log('error fetch info doctor', error);
    }
  },
);
export default doctorInfoSlice.reducer;
