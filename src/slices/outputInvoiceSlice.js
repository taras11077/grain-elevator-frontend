import { createSlice } from '@reduxjs/toolkit';
import {
  fetchInvoices,
  createInvoice,
  updateInvoice,
  deleteInvoice,
} from '../asyncThunks/outputInvoiceThunk';

const initialState = {
  outputInvoices: [],
  loading: false,
  error: null,
  pagination: {
	current: 1,
	pageSize: 10,
	total: 0,
  },
  sort: {
	sortField: 'shipmentDate', // поле для сортування за замовчуванням
	sortOrder: 'asc', // порядок сортування за замовчуванням
  },
  filters: {
	invoiceNumber: '',
	shipmentDate: '',
	vehicleNumber: '',
	productCategory: '',
	productWeight: '',
	supplierTitle: '',
	productTitle: '',
	createdByName: '',
  },
  selectedInvoice: null,
  isModalOpen: false,
};

const outputInvoiceSlice = createSlice({
  name: 'outputInvoice',
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
	setSelectedInvoice(state, action) {
	  state.selectedInvoice = action.payload;
	},
	clearSelectedInvoice: (state) => {
		state.selectedInvoice = null;
	  },
	toggleModal(state, action) {
	  state.isModalOpen = action.payload;
	},
  },
  extraReducers: (builder) => {
	builder
	  // Fetch outputInvoices
	  .addCase(fetchInvoices.pending, (state) => {
		state.loading = true;
	  })
	  .addCase(fetchInvoices.fulfilled, (state, action) => {
		state.outputInvoices = action.payload.data;
		state.pagination.total = action.payload.total;
		state.loading = false;
	  })
	  .addCase(fetchInvoices.rejected, (state, action) => {
		state.loading = false;
		state.error = action.payload;
	  })
	  // Create outputInvoice
	  .addCase(createInvoice.fulfilled, (state) => {
		state.isModalOpen = false;
	  })
	  // Update outputInvoice
	  .addCase(updateInvoice.fulfilled, (state) => {
		state.isModalOpen = false;
	  })
	  // Delete outputInvoice
	  .addCase(deleteInvoice.fulfilled, (state, action) => {
		const deletedId = action.meta.arg; // отримання ID з deleteInvoice
		state.outputInvoices = state.outputInvoices.filter((invoice) => invoice.id !== deletedId); // видалення зі списку
		state.pagination.total -= 1; // оновлення загальної кількості
	});
  },
});

export const {
  setFilters,
  setPagination,
  setSort,
  setSelectedInvoice,
  clearSelectedInvoice,
  toggleModal,
} = outputInvoiceSlice.actions;

export default outputInvoiceSlice.reducer;

