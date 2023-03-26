import fetch from '../../../utils/fetch';

export const getProfileDoctorById = id => {
  return fetch.get(`/doctors/profile/${id}`);
};

export const getDoctorProfile = () => {
  return fetch.getWithAuth('/doctors/profile');
};
