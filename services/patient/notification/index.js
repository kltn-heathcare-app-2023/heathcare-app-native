import fetch from '../../../utils/fetch';

export const getListNotificationById = id => {
  return fetch.get(`/notifications/${id}`);
};

export const updateStatusNotification = ids => {
  return fetch.put('/notifications', ids);
};
