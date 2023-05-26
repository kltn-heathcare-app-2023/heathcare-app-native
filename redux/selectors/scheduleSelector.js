import {createSelector} from '@reduxjs/toolkit';
import moment from 'moment';
export const scheduleSelector = state => state.schedules.schedule_list;
export const scheduleDaySelector = state => state.schedules.day_of_week;
export const scheduleDetailListSelector = state =>
  state.schedules.schedule_details_after_now;

export const doctorName = state => state.schedules.doctor_name;
export const filterScheduleByDayOfWeek = createSelector(
  scheduleSelector,
  scheduleDetailListSelector,
  scheduleDaySelector,
  (schedules, details, day) => {
    if (schedules.length > 0) {
      const now = new Date();

      //Lấy tất cả lịch ngày hôm nay
      const _schedules = schedules.filter(schedule => {
        return now.getDay() === day.getDay() &&
          now.getMonth() === day.getMonth()
          ? new Date(schedule['day']['day']).getDay() === day.getDay() &&
              now.getHours() <
                new Date(schedule['time']['time_start']).getHours()
          : new Date(schedule['day']['day']).getDay() === day.getDay();
      });

      // Lấy tất cả chi tiết lịch ngày hôm nay(lịch đã đăng ký)
      const schedule_details_equal_day_selected = details.filter(
        detail => new Date(detail.day_exam).getDay() === day.getDay(),
      );

      // Lấy mảng ngày ra để so sánh
      const schedule_details_day_exams =
        schedule_details_equal_day_selected.map(schedule => {
          return {
            day_exam: schedule.day_exam,
            doctor_id: schedule.doctor,
          };
        });

      // Tạo thêm date_compare để so sánh
      const __schedules = _schedules.map(schedule => {
        const time = `${new Date(
          schedule['time']['time_start'],
        ).getHours()}: ${new Date(
          schedule['time']['time_start'],
        ).getMinutes()}`;

        const dateStr = moment(day).format('YYYY-MM-DD');
        const date = moment(dateStr);
        const date_time = moment(time, 'HH:mm');
        date.set({
          hour: date_time.get('hour'),
          minute: date_time.get('minute'),
          second: date_time.get('second'),
        });
        return {
          ...schedule,
          date_compare: date,
          doctor_id: schedule.doctor._id,
        };
      });

      // Tiến hành so sánh
      const final_schedule = __schedules.filter(schedule => {
        // console.log(
        //   schedule.date_compare,
        //   schedule_details_day_exams,
        //   schedule_details_day_exams.some(_schedule =>
        //     moment(_schedule.day_exam).isSame(schedule.date_compare),
        //   ),
        // );
        return !schedule_details_day_exams.some(
          _schedule =>
            moment(_schedule.day_exam).isSame(schedule.date_compare) &&
            _schedule.doctor_id === schedule.doctor_id,
        );
      });

      // console.log(final_schedule);

      return final_schedule;
    }
    return [];
  },
);

export const filterScheduleByDoctorName = createSelector(
  filterScheduleByDayOfWeek,
  doctorName,
  (schedules, doctor) => {
    if (doctor) {
      console.log({doctor});
      return schedules.filter(schedule =>
        schedule.doctor.person.username.includes(doctor),
      );
    }

    return schedules;
  },
);
