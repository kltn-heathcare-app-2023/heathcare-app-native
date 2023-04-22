import env from '../../utils/env';
import fetch from '../../utils/fetch';

export const login = data => {
  return fetch.post(`/auth/login`, data);
};

export const register = data => {
  return fetch.post(`/auth/register`, data);
};

export const findAccount = phone_number => {
  return fetch.get(`/accounts/phone/${phone_number}`);
};

export const forgotPassword = data => {
  return fetch.put(`/accounts`, data);
};
