import { createSlice } from '@reduxjs/toolkit'
import {
	createWarehouseUnit,
	deleteWarehouseUnit,
	fetchWarehouseUnits,
	updateWarehouseUnit,
} from '../asyncThunks/warehouseThunk'

const initialState = {
	warehouseUnits: [],
  	pagination: { current: 1, pageSize: 10, total: 0 },
  	filters: {
	supplierTitle: '',
	productTitle: '',
	page: 1,
	size: 10,
  },
  sort: {
	sortField: 'supplierTitle',
	sortOrder: 'asc',
  },
  selectedWarehouseUnit: null,
  isModalOpen: false,
  loading: false,
  error: null,
};

const warehouseSlice = createSlice({
  name: 'warehouseUnits',
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
	setSelectedWarehouseUnit(state, action) {
	  state.selectedWarehouseUnit = action.payload;
	},
	toggleModal(state, action) {
	  state.isModalOpen = action.payload;
	},
  },
  extraReducers: (builder) => {
	builder
	  // Fetch warehouse-units
	  .addCase(fetchWarehouseUnits.pending, (state) => {
		state.loading = true;
		state.error = null;
	  })
	  .addCase(fetchWarehouseUnits.fulfilled, (state, action) => {
		state.warehouseUnits = action.payload.data;
		state.pagination.total = action.payload.total;
		state.loading = false;
	  })
	  .addCase(fetchWarehouseUnits.rejected, (state, action) => {
		state.loading = false;
		state.error = action.error.message;
	  })

	  // Create warehouse-unit
	  .addCase(createWarehouseUnit.fulfilled, (state) => {
		state.isModalOpen = false;
	  })

	  // Update warehouse-unit
	  .addCase(updateWarehouseUnit.fulfilled, (state, action) => {
		state.loading = false;
		state.error = null; //успішне оновлення, помилок немає

			//пошук юніта та його оновлення
		const index = state.warehouseUnits.findIndex((wu) => wu.id === action.payload.id);
		if (index !== -1) {
		  state.warehouseUnits[index] = { ...state.warehouseUnits[index], ...action.payload };
		}
	  })

	  .addCase(updateWarehouseUnit.rejected, (state, action) => {
		state.loading = false;

		// якщо сервер повернув дані про помилку, зберігаємо їх
		if (action.payload) {
		  state.error = action.payload.message || 'Помилка оновлення Складського юніту.';
		} else {
		  //у разі інших помилок
		  state.error = 'Виникла непередбачена помилка.';
		}
	  })

	  // warehouse-unit
	  .addCase(deleteWarehouseUnit.fulfilled, (state, action) => {
		state.warehouseUnits = state.warehouseUnits.filter(
		  (wu) => wu.id !== action.payload
		);
		state.pagination.total -= 1;
	  });
  },
});

export const {
  setFilters,
  setPagination,
  setSort,
  setSelectedWarehouseUnit,
  toggleModal,
} = warehouseSlice.actions;

export default warehouseSlice.reducer;