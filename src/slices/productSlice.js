import { createSlice } from '@reduxjs/toolkit';
import { 
	fetchProducts,
	createProduct,
	deleteProduct,
	updateProduct,
 } from '../asyncThunks/productThunk'

const initialState = {
products: [],
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
selectedProduct: null,
isModalOpen: false,
loading: false,
error: null,
};

const productSlice = createSlice({
  name: 'products',
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
	  setSelectedProduct(state, action) {
		state.selectedProduct = action.payload;
	  },
	  toggleModal(state, action) {
		state.isModalOpen = action.payload;
	  },

  },
  extraReducers: (builder) => {
	builder
		// Fetch Products
		.addCase(fetchProducts.pending, (state) => {
			state.loading = true;
			state.error = null;
		})
		.addCase(fetchProducts.fulfilled, (state, action) => {
			state.products = action.payload.data || [];
			state.pagination.total = action.payload.total;
			state.loading = false;
		})
		.addCase(fetchProducts.rejected, (state, action) => {
			state.loading = false;
			state.error = action.payload;
		})
		// Create Product
		.addCase(createProduct.fulfilled, (state) => {
			state.isModalOpen = false;
		})
	
		// Update Product
		.addCase(updateProduct.fulfilled, (state) => {
			state.isModalOpen = false;
		})
		.addCase(updateProduct.rejected, (state, action) => {
			state.loading = false;
			// якщо сервер повернув дані про помилку, зберігаємо їх
			if (action.payload) {
				state.error = action.payload.message || 'Помилка оновлення Продукції.';
			} else {
				//у разі інших помилок
				state.error = 'Виникла непередбачена помилка.';
			}
		})
		
		// Delete Product
		.addCase(deleteProduct.fulfilled, (state, action) => {
			const deletedId = action.meta.arg; // отримання ID з deleteProduct
			state.products = state.products.filter((product) => product.id !== deletedId);// видалення зі списку
			state.pagination.total -= 1;// оновлення загальної кількості
		});
	},
});
	
	export const {
	setFilters,
	setPagination,
	setSort,
	setSelectedProduct,
	toggleModal,
	} = productSlice.actions;

export default productSlice.reducer;

