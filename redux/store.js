import {configureStore} from '@reduxjs/toolkit';
import infoReducer from './slices/infoSlice';
import scheduleReducer from './slices/scheduleSlice';
import conversationReducer from './slices/conversationSlice';
import messageReducer from './slices/messageSlice';
import scheduleDetailReducer from './slices/scheduleDetailSlice';
import notificationReducer from './slices/notificationSlice';

export const store = configureStore({
  reducer: {
    info: infoReducer,
    schedules: scheduleReducer,
    conversations: conversationReducer,
    messages: messageReducer,
    schedule_details: scheduleDetailReducer,
    notifications: notificationReducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      immutableCheck: false,
      serializableCheck: false,
    }),
});
