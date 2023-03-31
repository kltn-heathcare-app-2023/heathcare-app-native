import fetch from '../../../utils/fetch';

export const getPatientExamByDoctorId = id => {
  return fetch.get(`/schedule-details/doctor/patient-list/${id}`);
};

export const getAllScheduleDetailUnAccepted = id => {
  return fetch.get(`/schedule-details/doctor/schedule-list/${id}`);
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
