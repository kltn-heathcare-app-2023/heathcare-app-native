import {createSelector} from '@reduxjs/toolkit';
import moment from 'moment';

export const infoSelector = state => state.info.user_info;
export const userAVGBMISelector = state => state.info.bmi_avg;
export const userBMIListSelector = state => state.info.bmi_list;
export const optionBMISelector = state => state.info.option_bmi;
export const userLastGlycemicSelector = state => state.info.glycemic_last;
export const userListGlycemicSelector = state => state.info.glycemic_list;
export const optionGlycemicSelector = state => state.info.option_glycemic;
export const userLastBloodPressureSelector = state =>
  state.info.blood_pressures[state.info.blood_pressures.length - 1] ?? {
    diastole: 0,
    systolic: 0,
  };
export const userListBloodPressureSelector = state =>
  state.info.blood_pressures;
export const optionBloodSelector = state => state.info.option_blood;
export const notificationByBMIMertric = state => state.info.rule ?? null;
export const notificationByGlycemicMetric = state =>
  state?.info?.glycemic_list[state.info.glycemic_list.length - 1]
    ?.notification ?? null;
export const infoStatusSelector = state => state.info.status;

export const userBMIListSelectorFilter = createSelector(
  userBMIListSelector,
  optionBMISelector,
  (bmis, option) => {
    const now = new Date();

    if (bmis.length > 0) {
      if (option === 'week') {
        const _bmis = bmis.filter(
          b => moment(b.createdAt).week() === moment(now).week(),
        );

        return _bmis;
      } else if (option === 'month') {
        const _bmis = bmis.filter(
          b => moment(b.createdAt).month() === moment(now).month(),
        );

        return _bmis;
      }
    }
    return [];
  },
);

export const userGlycemicListSelectorFilter = createSelector(
  userListGlycemicSelector,
  optionGlycemicSelector,
  (glycemics, option) => {
    const now = new Date();
    if (glycemics.length > 0) {
      if (option === 'week') {
        const _glycemics = glycemics.filter(
          b => moment(b.createdAt).week() === moment(now).week(),
        );

        return _glycemics;
      } else if (option === 'month') {
        const _glycemics = glycemics.filter(
          b => moment(b.createdAt).month() === moment(now).month(),
        );

        return _glycemics;
      }
    }
    return [];
  },
);

export const userBloodPressureListSelectorFilter = createSelector(
  userListBloodPressureSelector,
  optionBloodSelector,
  (bloods, option) => {
    const now = new Date();
    if (bloods.length > 0) {
      if (option === 'week') {
        const _bloods = bloods.filter(
          b => moment(b.createdAt).week() === moment(now).week(),
        );

        return _bloods;
      } else if (option === 'month') {
        const _bloods = bloods.filter(
          b => moment(b.createdAt).month() === moment(now).month(),
        );

        return _bloods;
      }
    }
    return [];
  },
);
