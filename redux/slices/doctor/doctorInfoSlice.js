import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {getDoctorProfile} from '../../../services/doctor/profile';

export const doctorInfoSlice = createSlice({
  name: 'doctor_info',
  initialState: {
    doctor_profile: {},
  },
  reducers: {
    resetDoctorProfile: state => {
      state.doctor_profile = {};
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchInfoDoctor.fulfilled, (state, action) => {
        state.doctor_profile = action.payload;
      })
      .addCase(fetchInfoDoctor.pending, () => {
        console.log('pending load profile doctor');
      });
  },
});

export const fetchInfoDoctor = createAsyncThunk(
  'fetch/doctor/info',
  async () => {
    try {
      const profile = await getDoctorProfile();
      return profile.data;
    } catch (error) {
      console.log('error fetch info doctor', error);
    }
  },
);
export default doctorInfoSlice.reducer;
