import env from "../../utils/env";
import fetch from "../../utils/fetch";

export const login = (data) => {
    return fetch.post(`/auth/login`, data);
};

export const register = (data) => {
    return fetch.post(`/auth/register`, data);
};
