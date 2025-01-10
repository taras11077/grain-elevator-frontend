import { createSlice } from '@reduxjs/toolkit';
import { 
	fetchSuppliers,
	createSupplier,
	deleteSupplier,
	updateSupplier,
 } from '../asyncThunks/supplierThunk'

const initialState = {
suppliers: [],
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
selectedSupplier: null,
isModalOpen: false,
loading: false,
error: null,
};

const supplierSlice = createSlice({
  name: 'suppliers',
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
	  setSelectedSupplier(state, action) {
		state.selectedSupplier = action.payload;
	  },
	  toggleModal(state, action) {
		state.isModalOpen = action.payload;
	  },

  },
  extraReducers: (builder) => {
	builder
		// Fetch suppliers
		.addCase(fetchSuppliers.pending, (state) => {
			state.loading = true;
			state.error = null;
		})
		.addCase(fetchSuppliers.fulfilled, (state, action) => {
			state.suppliers = action.payload.data || [];
			state.pagination.total = action.payload.total;
			state.loading = false;
		})
		.addCase(fetchSuppliers.rejected, (state, action) => {
			state.loading = false;
			state.error = action.payload;
		})
		// Create Supplier
		.addCase(createSupplier.fulfilled, (state) => {
			state.isModalOpen = false;
		})
	
		// Update Supplier
		.addCase(updateSupplier.fulfilled, (state) => {
			state.isModalOpen = false;
		})
		.addCase(updateSupplier.rejected, (state, action) => {
			state.loading = false;
			// якщо сервер повернув дані про помилку, зберігаємо їх
			if (action.payload) {
				state.error = action.payload.message || 'Помилка оновлення Продукції.';
			} else {
				//у разі інших помилок
				state.error = 'Виникла непередбачена помилка.';
			}
		})
		
		// Delete Supplier
		.addCase(deleteSupplier.fulfilled, (state, action) => {
			const deletedId = action.meta.arg; // отримання ID з deleteSupplier
			state.suppliers = state.suppliers.filter((Supplier) => Supplier.id !== deletedId);// видалення зі списку
			state.pagination.total -= 1;// оновлення загальної кількості
		});
	},
});
	
	export const {
	setFilters,
	setPagination,
	setSort,
	setSelectedSupplier,
	toggleModal,
	} = supplierSlice.actions;

export default supplierSlice.reducer;

