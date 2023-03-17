import {createSelector} from '@reduxjs/toolkit';
import moment from 'moment';

export const infoSelector = state => state.info.user_info;
export const userAVGBMISelector = state => state.info.bmi_avg;
export const userBMIListSelector = state => state.info.bmi_list;
export const optionBMISelector = state => state.info.option_bmi;
export const userLastGlycemicSelector = state =>
  state.info.glycemic_list[state.info.glycemic_list.length - 1]?.metric ?? 0;
export const userListGlycemicSelector = state => state.info.glycemic_list;
export const notificationByBMIMertric = state => state.info.rule ?? null;
export const notificationByGlycemicMetric = state =>
  state?.info?.glycemic_list[state.info.glycemic_list.length - 1]
    ?.notification ?? null;

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
