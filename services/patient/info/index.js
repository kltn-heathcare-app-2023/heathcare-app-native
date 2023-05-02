import fetch from '../../../utils/fetch';

export const createIn4 = (data, token) => {
  return fetch.postWithAuth(`${env.API_URL}/patients`, data, token);
};

export const getIn4 = () => {
  return fetch.getWithAuth('/patients');
};

export const getBMIById = id => {
  return fetch.getWithAuth(`/bmis/${id}`);
};

export const getLastGlycemicById = id => {
  return fetch.getWithAuth(`/glycemics/last/${id}`);
};

export const getListGlycemicById = id => {
  return fetch.getWithAuth(`/glycemics/${id}`);
};

export const postBMI = data => {
  return fetch.postWithAuth(`/bmis`, data);
};

export const postGlycemic = data => {
  return fetch.postWithAuth(`/glycemics`, data);
};

export const getListBloodPressure = id => {
  return fetch.get(`/blood-pressures/${id}`);
};

export const postBloodPressure = data => {
  return fetch.postWithAuth(`/blood-pressures`, data);
};

export const getAllHistoriesById = id => {
  return fetch.get(`/patients/${id}/histories`);
};
