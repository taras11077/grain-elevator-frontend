import { createSlice } from '@reduxjs/toolkit'
import {
	createTechnologicalOperation,
	deleteTechnologicalOperation,
	fetchTechnologicalOperations,
	updateTechnologicalOperation,
} from '../asyncThunks/technologicalOperationThunk'

const initialState = {
technologicalOperations: [],
pagination: { current: 1, pageSize: 10, total: 0 },
filters: {
  title: '',
  createdByName: '',
  page: 1,
  size: 10,
},
sort: {
  sortField: 'title',
  sortOrder: 'asc',
},
selectedOperation: null,
isModalOpen: false,
loading: false,
error: null,
};

const technologicalOperationSlice = createSlice({
  name: 'technologicalOperations',
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
	  setSelectedOperation(state, action) {
		state.selectedOperation = action.payload;
	  },
	  toggleModal(state, action) {
		state.isModalOpen = action.payload;
	  },

  },
  extraReducers: (builder) => {
    builder
		// Fetch Operations
		.addCase(fetchTechnologicalOperations.pending, (state) => {
			state.loading = true;
			state.error = null;
		})
		.addCase(fetchTechnologicalOperations.fulfilled, (state, action) => {
			state.technologicalOperations = action.payload.data || [];
			state.pagination.total = action.payload.total;
			state.loading = false;
		})
		.addCase(fetchTechnologicalOperations.rejected, (state, action) => {
			state.loading = false;
			state.error = action.payload;
		})
		// Create Operation
		.addCase(createTechnologicalOperation.fulfilled, (state) => {
			state.isModalOpen = false;
		})
	
		// Update Operation
		.addCase(updateTechnologicalOperation.fulfilled, (state) => {
			state.isModalOpen = false;
		})
		.addCase(updateTechnologicalOperation.rejected, (state, action) => {
			state.loading = false;
			// якщо сервер повернув дані про помилку, зберігаємо їх
			if (action.payload) {
				state.error = action.payload.message || 'Помилка оновлення Технологичної операції.';
			} else {
				//у разі інших помилок
				state.error = 'Виникла непередбачена помилка.';
			}
		})
		
		// Delete Operation
		.addCase(deleteTechnologicalOperation.fulfilled, (state, action) => {
			const deletedId = action.meta.arg; // отримання ID з deleteTechnologicalOperation
			state.technologicalOperations = state.technologicalOperations.filter((technologicalOperation) => technologicalOperation.id !== deletedId);// видалення зі списку
			state.pagination.total -= 1;// оновлення загальної кількості
		});
	},
});
	
	export const {
	setFilters,
	setPagination,
	setSort,
	setSelectedOperation,
	toggleModal,
	} = technologicalOperationSlice.actions;

export default technologicalOperationSlice.reducer;