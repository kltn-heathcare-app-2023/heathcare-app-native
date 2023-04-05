import {createAsyncThunk, createSelector, createSlice} from '@reduxjs/toolkit';
import {type} from '../../common/constant';
import {
  getListNotificationById,
  updateStatusNotification,
} from '../../services/patient/notification';

export const notificationSlice = createSlice({
  name: 'notifications',
  initialState: {
    notification_list: [],
    notification_type: type.RULE_ALL,
  },
  reducers: {
    updateNotificationType: (state, action) => {
      state.notification_type = action.payload;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchNotificationListById.fulfilled, (state, action) => {
        state.notification_list = action.payload;
      })
      .addCase(updateStatusSeenNotification.fulfilled, (state, action) => {
        state.notification_list = state.notification_list.map(item => {
          return {...item, hasSeen: true};
        });
      })
      .addCase(
        updateStatusSeenNotificationByDoctor.fulfilled,
        (state, action) => {
          state.notification_list = state.notification_list.map(item => {
            return {...item, hasSeen: true};
          });
        },
      );
  },
});

export const fetchNotificationListById = createAsyncThunk(
  'notifications/get',
  async id => {
    try {
      const resp = await getListNotificationById(id);
      if (resp?.data) {
        return resp.data;
      }
    } catch (error) {
      console.error('error fetch notification -> ', error);
    }
  },
);

export const updateStatusSeenNotification = createAsyncThunk(
  'notifications/update/hasSeen',
  async ids => {
    try {
      const resp = await updateStatusNotification({ids});
      const resp_ids = resp.map(notification => notification._id);
      return resp_ids;
    } catch (error) {
      console.error('error update notifications -> ', error);
    }
  },
);

export const updateStatusSeenNotificationByDoctor = createAsyncThunk(
  'notifications/update/hasSeen/doctor',
  async ids => {
    try {
      const resp = await updateStatusNotification({ids});
      const resp_ids = resp.map(notification => notification._id);
      return resp_ids;
    } catch (error) {
      console.error('error update notifications -> ', error);
    }
  },
);

export const {updateNotificationType} = notificationSlice.actions;

export const notification_list_selector = state =>
  state.notifications.notification_list;
export const notification_type_selector = state =>
  state.notifications.notification_type;

export const notification_list_filter = createSelector(
  notification_list_selector,
  notification_type_selector,
  (notifications, rule) => {
    if (rule === type.RULE_ALL) {
      return notifications.filter(notification => !notification.hasSeen);
    } else if (rule === type.RULE_HAS_SEEN) {
      return notifications.filter(notification => notification.hasSeen);
    } else if (rule === type.RULE_DOCTOR_REMIND) {
      return notifications.filter(
        notification => notification.rule === type.RULE_DOCTOR_REMIND,
      );
    } else {
      return notifications.filter(notification =>
        notification.rule.includes('SCHEDULE'),
      );
    }
  },
);

export const notification_list_unread_filter = createSelector(
  notification_list_selector,
  notifications => {
    if (notifications) {
      const notification_unread_size = notifications.filter(
        notification => !notification.hasSeen,
      ).length;
      console.log(notification_unread_size);
      return notification_unread_size;
    }

    return 0;
  },
);

export default notificationSlice.reducer;
