import fetch from '../../../utils/fetch';

export const getPatientExamByDoctorId = id => {
  return fetch.get(`/schedule-details/doctor/patient-list/${id}`);
};

export const getAllScheduleDetailUnAccepted = id => {
  return fetch.get(`/schedule-details/doctor/schedule-list-waiting/${id}`);
};

export const getAllScheduleWaitingExam = id => {
  return fetch.get(
    `/schedule-details/doctor/schedule-list/${id}?filter=view_wating_exam`,
  );
};

export const getAllWorkingDay = id => {
  return fetch.get(`/schedules/doctor/${id}`);
};

export const createRemindToPatient = (patientId, data) => {
  return fetch.postWithAuth(`/doctors/remind/${patientId}`, data);
};

export const getAllConversation = id => {
  return fetch.get(`/conversations/doctor/${id}`);
};

export const acceptScheduleDetailByScheduleId = id => {
  return fetch.put(`/schedule-details/doctor/accept/${id}`);
};
