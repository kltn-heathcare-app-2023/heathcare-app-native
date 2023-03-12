export const infoSelector = state => state.info.user_info;
export const userAVGBMISelector = state => state.info.bmi_avg;
export const userBMIListSelector = state => state.info.bmi_list;
export const userLastGlycemicSelector = state =>
  state.info.glycemic_list[state.info.glycemic_list.length - 1]?.metric ?? 0;
export const userListGlycemicSelector = state => state.info.glycemic_list;
export const notificationByBMIMertric = state => state.info.rule;
export const notificationByGlycemicMetric = state =>
  state.info.glycemic_list[state.info.glycemic_list.length - 1].notification;
