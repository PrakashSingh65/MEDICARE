import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  selectedAppointment: null,
  bookingDraft: {
    doctorId: null,
    doctorName: '',
    specialty: '',
    consultationType: 'in-person', // 'in-person' | 'online'
    date: null,
    timeSlot: null,
    reason: '',
    notes: '',
  },
  filters: {
    status: 'all', // 'all' | 'upcoming' | 'completed' | 'cancelled'
    searchQuery: '',
    dateRange: 'all',
  },
};

const appointmentSlice = createSlice({
  name: 'appointment',
  initialState,
  reducers: {
    setSelectedAppointment: (state, action) => {
      state.selectedAppointment = action.payload;
    },
    clearSelectedAppointment: (state) => {
      state.selectedAppointment = null;
    },
    updateBookingDraft: (state, action) => {
      state.bookingDraft = { ...state.bookingDraft, ...action.payload };
    },
    resetBookingDraft: (state) => {
      state.bookingDraft = initialState.bookingDraft;
    },
    setAppointmentFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    resetAppointmentFilters: (state) => {
      state.filters = initialState.filters;
    },
  },
});

export const {
  setSelectedAppointment,
  clearSelectedAppointment,
  updateBookingDraft,
  resetBookingDraft,
  setAppointmentFilters,
  resetAppointmentFilters,
} = appointmentSlice.actions;

export const selectSelectedAppointment = (state) => state.appointment.selectedAppointment;
export const selectBookingDraft = (state) => state.appointment.bookingDraft;
export const selectAppointmentFilters = (state) => state.appointment.filters;

export default appointmentSlice.reducer;
