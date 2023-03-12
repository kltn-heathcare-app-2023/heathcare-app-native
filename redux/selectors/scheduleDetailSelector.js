import {createSelector} from '@reduxjs/toolkit';

export const scheduleDetailList = state =>
  state.schedule_details.schedule_detail_list;

export const scheduleDetailListAfterNow = createSelector(
  scheduleDetailList,
  schedules => {
    const now = new Date();

    if (schedules?.length > 0) {
      const _schdules = schedules.filter(
        schedule => new Date(schedule.day_exam) >= now,
      );
      return _schdules;
    }

    return [];
  },
);
