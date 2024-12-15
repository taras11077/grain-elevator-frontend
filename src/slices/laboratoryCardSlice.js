import { createSlice } from '@reduxjs/toolkit';
import {
  fetchLaboratoryCards,
  createLaboratoryCard,
  updateLaboratoryCard,
  deleteLaboratoryCard,
} from '../asyncThunks/laboratoryCardThunk';

const initialState = {
  laboratoryCards: [],
  pagination: { current: 1, pageSize: 10, total: 0 },
  filters: {
    invoiceNumber: '',
	arrivalDate: '',
    physicalWeight: '',
    supplierTitle: '',
    productTitle: '',
    createdByName: '',
    page: 1,
    size: 10,
  },
  sort: {
    sortField: 'arrivalDate',
    sortOrder: 'asc',
  },
  selectedCard: null,
  isModalOpen: false,
  loading: false,
  error: null,
};

const laboratoryCardSlice = createSlice({
  name: 'laboratoryCards',
  initialState,
  reducers: {
    setFilters(state, action) {
      state.filters = { ...state.filters, ...action.payload };
    },
    setPagination(state, action) {
      state.pagination = { ...state.pagination, ...action.payload };
    },
    setSort(state, action) {
      state.sort = { ...state.sort, ...action.payload };
    },
    setSelectedCard(state, action) {
      state.selectedCard = action.payload;
    },
    toggleModal(state, action) {
      state.isModalOpen = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Laboratory Cards
      .addCase(fetchLaboratoryCards.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchLaboratoryCards.fulfilled, (state, action) => {
        state.laboratoryCards = action.payload.data;
        state.pagination.total = action.payload.total;
        state.loading = false;
      })
      .addCase(fetchLaboratoryCards.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Create Laboratory Card
      .addCase(createLaboratoryCard.fulfilled, (state) => {
        state.isModalOpen = false;
      })

	  
      // Update Laboratory Card
      .addCase(updateLaboratoryCard.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null; //успішне оновлення, помилок немає

        //пошук картки та її оновлення
        const index = state.laboratoryCards.findIndex((card) => card.id === action.payload.id);
        if (index !== -1) {
          state.laboratoryCards[index] = { ...state.laboratoryCards[index], ...action.payload };
        }
      })

	  .addCase(updateLaboratoryCard.rejected, (state, action) => {
        state.loading = false;

        // якщо сервер повернув дані про помилку, зберігаємо їх
        if (action.payload) {
          state.error = action.payload.message || 'Помилка оновлення лабораторної карточки.';
        } else {
          //у разі інших помилок
          state.error = 'Виникла непередбачена помилка.';
        }
      })

      // Delete Laboratory Card
      .addCase(deleteLaboratoryCard.fulfilled, (state, action) => {
        state.laboratoryCards = state.laboratoryCards.filter(
          (card) => card.id !== action.payload
        );
        state.pagination.total -= 1;
      });
  },
});

export const {
  setFilters,
  setPagination,
  setSort,
  setSelectedCard,
  toggleModal,
} = laboratoryCardSlice.actions;

export default laboratoryCardSlice.reducer;
