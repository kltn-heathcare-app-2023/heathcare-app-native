import fetch from '../../../utils/fetch';

export const getAllConversationByPatientId = id => {
  return fetch.get(`/conversations/patient/${id}`);
};

export const getAllMessagesByConversationId = id => {
  return fetch.get(`/messages/${id}`);
};

export const postMessage = data => {
  return fetch.postFormWithAuth(`/messages`, data);
};
