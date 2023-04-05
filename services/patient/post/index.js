const {default: fetch} = require('../../../utils/fetch');

export const getAllPost = async () => {
  return fetch.get('/posts');
};

export const likePost = async (id, user_id) => {
  return fetch.post(`/posts/${id}/like`, {
    user_id,
  });
};

export const dislikePost = async (id, user_id) => {
  return fetch.post(`/posts/${id}/dislike`, {
    user_id,
  });
};

export const getCommentByPost = async id => {
  return fetch.get(`/comments/${id}`);
};

export const createCommentForPost = async (id, data) => {
  return fetch.postFormWithAuth(`/comments/${id}`, data);
};
