import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import candidatesReducer from '../features/candidates/candidatesSlice';
import analyticsReducer from '../features/analytics/analyticsSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    candidates: candidatesReducer,
    analytics: analyticsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
