import env from './env';
import storage from './storage';

const post = async (url, data) => {
  try {
    const resp = await fetch(`${env.API_URL}${url}`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const res = await resp.json();
    if (res?.data) return res;
    return Promise.reject(res);
  } catch (error) {
    console.error('error fetch post request', error);
  }
};

const put = async (url, data) => {
  try {
    const resp = await fetch(`${env.API_URL}${url}`, {
      method: 'PUT',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const res = await resp.json();
    if (res?.data) return res.data;
    return Promise.reject(res);
  } catch (error) {
    console.error('error fetch post request', error);
  }
};

const postFormWithAuth = async (url, data) => {
  const token = await storage.get('accessToken');
  try {
    const resp = await fetch(`${env.API_URL}${url}`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'content-type': 'multipart/form-data',
        Authorization: `Bearer ${token}`,
      },
      body: data,
    });

    const res = await resp.json();
    return res;
  } catch (error) {
    console.error('error fetch post request', error);
  }
};

const postWithAuth = async (url, data) => {
  const token = await storage.get('accessToken');
  try {
    const resp = await fetch(`${env.API_URL}${url}`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'content-type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    const res = await resp.json();
    // console.log(res);
    if (res?.data) return res;
    return Promise.reject(res);
  } catch (error) {
    console.error('error fetch post request', error);
  }
};

const getWithAuth = async url => {
  try {
    const token = await storage.get('accessToken');
    const resp = await fetch(`${env.API_URL}${url}`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await resp.json();
    return data;
  } catch (error) {
    return Promise.reject({
      error,
    });
  }
};

const get = async url => {
  try {
    const resp = await fetch(`${env.API_URL}${url}`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
    });
    const res = await resp.json();
    if (res?.data) return res;
  } catch (error) {
    return Promise.reject({
      error,
    });
  }
};

const _delete = async (url, data) => {
  try {
    const resp = await fetch(`${env.API_URL}${url}`, {
      method: 'DELETE',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const res = await resp.json();
    // console.log(res);
    if (res?.data) return res.data;
    return Promise.reject({
      res,
    });
  } catch (error) {
    return Promise.reject({
      error,
    });
  }
};

export default {
  get,
  post,
  put,
  postWithAuth,
  postFormWithAuth,
  getWithAuth,
  _delete,
};
