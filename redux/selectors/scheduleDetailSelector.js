import {createSelector} from '@reduxjs/toolkit';
import moment from 'moment';

export const scheduleDetailList = state =>
  state.schedule_details.schedule_detail_list;

export const scheduleDetailListAfterNow = createSelector(
  scheduleDetailList,
  schedules => {
    const now = new Date();

    if (schedules?.length > 0) {
      const _schedules = schedules.filter(schedule => {
        return moment(schedule.day_exam)
          .add(45, 'minutes')
          .isAfter(moment(now));
      });

      const schedule_now = _schedules.filter(
        schedule =>
          moment(schedule.day_exam).format('DD/MM/YYYY') ===
            moment(new Date()).format('DD/MM/YYYY') && schedule.status,
      );

      const schedule_waiting_accept = _schedules.filter(
        schedule => schedule.status === false,
      );

      const schedule_waiting_accept_ids = schedule_waiting_accept.map(
        schedule => schedule._id,
      );

      const schedule_now_ids = schedule_now.map(schedule => schedule._id);

      const schedule_after = _schedules.filter(schedule => {
        return (
          !schedule_now_ids.includes(schedule._id) &&
          !schedule_waiting_accept_ids.includes(schedule._id)
        );
      });

      return schedule_now
        .concat(schedule_waiting_accept)
        .concat(schedule_after);
    }

    return [];
  },
);
