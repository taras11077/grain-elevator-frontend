import { createSlice } from '@reduxjs/toolkit';
import { fetchRoles } from '../asyncThunks/roleThunk';

const initialState = {
  roles: [],
  rolesLoading: false,
  rolesError: null,
};

const roleSlice = createSlice({
  name: 'roles',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRoles.pending, (state) => {
        state.rolesLoading = true;
        state.rolesError = null;
      })
      .addCase(fetchRoles.fulfilled, (state, action) => {
        state.rolesLoading = false;
        state.roles = action.payload;
      })
      .addCase(fetchRoles.rejected, (state, action) => {
        state.rolesLoading = false;
        state.rolesError = action.error.message;
      });
  },
});

export default roleSlice.reducer;
