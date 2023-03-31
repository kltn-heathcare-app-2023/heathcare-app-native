import {createSelector} from '@reduxjs/toolkit';
import moment from 'moment';
export const scheduleSelector = state => state.schedules.schedule_list;
export const scheduleDaySelector = state => state.schedules.day_of_week;

export const filterScheduleByDayOfWeek = createSelector(
  scheduleSelector,
  scheduleDaySelector,
  (schedules, day) => {
    if (schedules.length > 0) {
      const now = new Date();
      const _schedules = schedules.filter(schedule => {
        return now.getDay() === day
          ? new Date(schedule['day']['day']).getDay() === day &&
              now.getHours() <
                new Date(schedule['time']['time_start']).getHours()
          : new Date(schedule['day']['day']).getDay() === day;
      });

      return _schedules;
    }
    return [];
  },
);
