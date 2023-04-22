import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {
  getBMIById,
  getIn4,
  getLastGlycemicById,
  getListBloodPressure,
  getListGlycemicById,
} from '../../services/patient/info';

export const infoSlice = createSlice({
  name: 'info',
  initialState: {
    user_info: {},
    bmi_list: [],
    bmi_avg: 0,
    glycemic_list: 0,
    glycemic_last: [],
    blood_pressures: [],
    rule: '',
    option_bmi: 'week',
    option_glycemic: 'week',
    option_blood: 'week',
    status: null,
  },
  reducers: {
    updateAVGBMI: (state, action) => {
      state.bmi_avg = action.payload;
    },
    addBMI: (state, action) => {
      state.bmi_list.push(action.payload);
    },
    addGlycemic: (state, action) => {
      state.glycemic_list.push(action.payload);
      // console.log(state.glycemic_last);
      state.glycemic_last.push(action.payload);
    },
    addBlood: (state, action) => {
      state.blood_pressures.push(action.payload);
      state.user_info.metrics.last_blood_pressures = {...action.payload};
    },
    resetUserInfo: state => {
      state.user_info = {};
      state.bmi_list = [];
      state.bmi_avg = 0;
      state.glycemic_list = [];
      state.rule = '';
    },
    updateOptionBMI: (state, action) => {
      state.option_bmi = action.payload;
    },
    updateOptionGlycemic: (state, action) => {
      state.option_glycemic = action.payload;
    },
    updateOptionBlood: (state, action) => {
      state.option_blood = action.payload;
    },
    updateUserInfoAfterChange: (state, action) => {
      state.user_info = action.payload;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchUserInfo.fulfilled, (state, action) => {
        state.user_info = action.payload.user;
        state.bmi_avg = action.payload.bmis.avgBMI ?? 0;
        state.bmi_list = action.payload.bmis.bmis;
        state.glycemic_list = action.payload.glycemic;
        state.glycemic_last = action.payload.last_glycemic ?? [];
        state.blood_pressures = action.payload.blood_pressures;
        state.rule = action.payload.bmis.rule.notification ?? null;
        state.status = action.payload.status;
      })
      .addCase(fetchUserInfo.pending, (state, action) => {
        console.log('pending load user info');
      })
      .addCase(fetchUserInfo.rejected, (state, action) => {
        console.log('rejected load user info');
      });
  },
});

export const fetchUserInfo = createAsyncThunk('info/fetchInfo', async () => {
  try {
    console.log('get user info');
    const resp = await getIn4();
    const {patient, status, metrics} = resp.data;

    if (patient) {
      const user_id = patient._id;
      const resp_values = await Promise.all([
        getBMIById(user_id),
        getListGlycemicById(user_id),
        getLastGlycemicById(user_id),
        getListBloodPressure(user_id),
      ]);

      const bmis = resp_values[0].data;
      const glycemic = resp_values[1].data;
      const last_glycemic = resp_values[2].data;
      const blood_pressures = resp_values[3].data;

      patient['metrics'] = metrics;

      return {
        user: patient,
        bmis,
        glycemic,
        last_glycemic,
        blood_pressures,
        status,
      };
    }
  } catch (error) {
    console.error('error in fetch user', error);
  }
});

export const {
  updateAVGBMI,
  addBMI,
  resetUserInfo,
  addGlycemic,
  updateOptionBMI,
  addBlood,
  updateOptionBlood,
  updateUserInfoAfterChange,
} = infoSlice.actions;

export default infoSlice.reducer;
