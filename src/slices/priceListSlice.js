import { createSlice } from '@reduxjs/toolkit';
import {
	fetchPriceLists,
	createPriceList,
	updatePriceList,
	deletePriceList,
} from '../asyncThunks/priceListThunk';

const initialState = {
	priceLists: [],
	pagination: { current: 1, pageSize: 10, total: 0 },
	filters: {
		productTitle: '',
		createdByName: '',
	  },
  sort: {
	sortField: 'productTitle', // поле для сортування за замовчуванням
	sortOrder: 'asc', // порядок сортування за замовчуванням
  },
  selectedPriceList: null,
  isModalOpen: false,
  loading: false,
  error: null,
};

const priceListSlice = createSlice({
  name: 'priceList',
  initialState,
  reducers: {
	setFilters(state, action) {
	  state.filters = { ...state.filters, ...action.payload };
	},
	setPagination(state, action) {
	  state.pagination = { ...state.pagination, ...action.payload };
	},
	setSort: (state, action) => {
		state.sort = action.payload;
	  },
	setSelectedPriceList(state, action) {
	  state.selectedPriceList = action.payload;
	},
	toggleModal(state, action) {
	  state.isModalOpen = action.payload;
	},
  },
  extraReducers: (builder) => {
	builder
	  // Fetch priceLists
	  .addCase(fetchPriceLists.pending, (state) => {
		state.loading = true;
	  })
	  .addCase(fetchPriceLists.fulfilled, (state, action) => {
		state.priceLists = action.payload.data || [];
		state.pagination.total = action.payload.total;
		state.loading = false;
	  })
	  .addCase(fetchPriceLists.rejected, (state, action) => {
		state.loading = false;
		state.error = action.payload;
	  })
	  // Create priceList
	  .addCase(createPriceList.fulfilled, (state) => {
		state.isModalOpen = false;
	  })
	  // Update priceList
	  .addCase(updatePriceList.fulfilled, (state) => {
		state.isModalOpen = false;
	  })
	  // Delete priceList
	  .addCase(deletePriceList.fulfilled, (state, action) => {
		const deletedId = action.meta.arg; // отримання ID з deletePriceList
		state.reports = state.priceLists.filter((list) => list.id !== deletedId); // видалення зі списку
		state.pagination.total -= 1; // оновлення загальної кількості
	});
  },
});


export const {
  setFilters,
  setPagination,
  setSort,
  setSelectedPriceList,
  toggleModal,
} = priceListSlice.actions;

export default priceListSlice.reducer;