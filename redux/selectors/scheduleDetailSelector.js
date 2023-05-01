import {createSelector} from '@reduxjs/toolkit';
import moment from 'moment';

export const scheduleDetailList = state =>
  state.schedule_details.schedule_detail_list;

export const scheduleDetailListAfterNow = createSelector(
  scheduleDetailList,
  schedules => {
    const now = new Date();

    if (schedules?.length > 0) {
      const _schedules = schedules.filter(
        schedule => new Date(schedule.day_exam) >= now,
      );

      const _schedule_now = _schedules.filter(
        schedule => moment(schedule.day_exam).diff(new Date(), 'day') === 0,
      );

      const _schedule_now_ids = _schedule_now.map(schedule => schedule._id);

      const _schedule_after = _schedules.filter(schedule => {
        return !_schedule_now_ids.includes(schedule._id);
      });

      return _schedule_now.concat(_schedule_after);
    }

    return [];
  },
);
