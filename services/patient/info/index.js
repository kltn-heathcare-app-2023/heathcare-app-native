import fetch from "../../../utils/fetch";

export const createIn4 = (data, token) => {
    return fetch.postWithAuth(`${env.API_URL}/patients`, data, token);
};

export const getIn4 = () => {
    return fetch.getWithAuth("/patients");
};

export const getBMIById = (id) => {
    return fetch.getWithAuth(`/bmis/${id}`);
};

export const getLastGlycemicById = (id) => {
    return fetch.getWithAuth(`/glycemics/last/${id}`);
};

export const postBMI = (data) => {
    return fetch.postWithAuth(`/bmis`, data);
};
