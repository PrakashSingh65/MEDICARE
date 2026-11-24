import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  selectedDoctor: null,
  searchQuery: '',
  selectedSpecialty: 'all',
  sortBy: 'rating', // 'rating' | 'experience' | 'fee'
};

const doctorSlice = createSlice({
  name: 'doctor',
  initialState,
  reducers: {
    setSelectedDoctor: (state, action) => {
      state.selectedDoctor = action.payload;
    },
    clearSelectedDoctor: (state) => {
      state.selectedDoctor = null;
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    setSelectedSpecialty: (state, action) => {
      state.selectedSpecialty = action.payload;
    },
    setSortBy: (state, action) => {
      state.sortBy = action.payload;
    },
    resetDoctorFilters: (state) => {
      state.searchQuery = '';
      state.selectedSpecialty = 'all';
      state.sortBy = 'rating';
    },
  },
});

export const {
  setSelectedDoctor,
  clearSelectedDoctor,
  setSearchQuery,
  setSelectedSpecialty,
  setSortBy,
  resetDoctorFilters,
} = doctorSlice.actions;

export const selectSelectedDoctor = (state) => state.doctor.selectedDoctor;
export const selectDoctorSearchQuery = (state) => state.doctor.searchQuery;
export const selectSelectedSpecialty = (state) => state.doctor.selectedSpecialty;
export const selectDoctorSortBy = (state) => state.doctor.sortBy;

export default doctorSlice.reducer;
