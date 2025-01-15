import { createSlice } from '@reduxjs/toolkit';
import { fetchUserData, login, logout, updateLastSeenOnline } from '../asyncThunks/authThunk';

const initialState = {
    token: null,
    loading: false,
    userData: {},
    error: null, 
};

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder
            // Logout
            .addCase(logout.fulfilled, (state) => {
                state.loading = false;
                state.token = null;
                state.userData = {};
            })

            // Login
            .addCase(login.pending, (state) => {
                state.loading = true;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.token = action.payload.token;
                state.userData = action.payload.user;
                state.loading = false;
            })
            .addCase(login.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Fetch User Data
            .addCase(fetchUserData.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchUserData.fulfilled, (state, action) => {
                state.token = action.payload.token;
                state.userData = action.payload.userInfo;
                state.loading = false;
            })
            .addCase(fetchUserData.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.token = null;
                state.userData = {};
            })

            // Update Last Seen Online
            .addCase(updateLastSeenOnline.pending, (state) => {
                state.loading = true;
            })
            .addCase(updateLastSeenOnline.fulfilled, (state, action) => {
                state.loading = false;
            })
            .addCase(updateLastSeenOnline.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    },
});

export default authSlice.reducer;
