import fetch from "../../utils/fetch";

export const getAllSchedules = () => fetch.get("/schedules");
