import fetch from "../../../utils/fetch";

export const registerSchedule = (data) => {
    return fetch.postWithAuth("/schedule-details", data);
};

export const getAllScheduleOfMe = (id) => {
    return fetch.get(`/schedule-details/patient/${id}`);
};

export const cancelScheduleDetail = (id, data) => {
    return fetch._delete(`/schedule-details/${id}`, data);
};
