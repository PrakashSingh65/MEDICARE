import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice.js';
import uiReducer from './uiSlice.js';
import appointmentReducer from './appointmentSlice.js';
import doctorReducer from './doctorSlice.js';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    ui: uiReducer,
    appointment: appointmentReducer,
    doctor: doctorReducer,
  },
});

export default store;
