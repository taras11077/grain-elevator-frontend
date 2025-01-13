import { createSlice } from '@reduxjs/toolkit';
import { fetchStatistic } from '../asyncThunks/statisticThunk'; 

const initialState = {
    supplierData: [], 
    productData: [],  
    loading: false,
    error: null,
};

const statisticSlice = createSlice({
    name: 'statistic',
    initialState,
    reducers: {
        toggleModal(state, action) {
            state.isModalOpen = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchStatistic.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchStatistic.fulfilled, (state, action) => {
                state.supplierData = action.payload.bySupplier || []; 
                state.productData = action.payload.byProduct || [];
                state.loading = false;
            })
            .addCase(fetchStatistic.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Помилка отримання даних';
            });
    },
});

export const { toggleModal } = statisticSlice.actions; // Експорт дій
export default statisticSlice.reducer; // Експорт редюсера
