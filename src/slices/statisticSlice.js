import { createSlice } from '@reduxjs/toolkit';
import { fetchStatistic, fetchTimelineStatistic } from '../asyncThunks/statisticThunk';

const initialState = {
    bySupplier: {},
    byProduct: {},
    bySupplierTimeline: {},
    byProductTimeline: {},
    loading: false,
    error: null,
};

const statisticSlice = createSlice({
    name: 'statistic',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        // Обробка fetchStatistic
        builder
            .addCase(fetchStatistic.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchStatistic.fulfilled, (state, action) => {
                state.loading = false;
                state.bySupplier = action.payload.bySupplier;
                state.byProduct = action.payload.byProduct;
            })
            .addCase(fetchStatistic.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Помилка при отриманні статистики.';
            });

        // Обробка fetchTimelineStatistic
        builder
            .addCase(fetchTimelineStatistic.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchTimelineStatistic.fulfilled, (state, action) => {
                state.loading = false;
                state.bySupplierTimeline = action.payload.bySupplierTimeline;
                state.byProductTimeline = action.payload.byProductTimeline;
            })
            .addCase(fetchTimelineStatistic.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Помилка при отриманні статистики по часу.';
            });
    },
});

export default statisticSlice.reducer;
