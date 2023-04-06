import fetch from '../../utils/fetch';

export const getAllSchedules = () => fetch.get('/schedules');
export const getAllScheduleDetailsAfterNow = () =>
  fetch.get('/schedule-details');
