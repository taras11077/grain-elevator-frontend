import { createSlice } from '@reduxjs/toolkit';
import {
  fetchInvoices,
  createInvoice,
  updateInvoice,
  deleteInvoice,
} from '../asyncThunks/inputInvoiceThunk';


const initialState = {
  invoices: [],
  loading: false,
  error: null,
  pagination: {
    current: 1,
    pageSize: 10,
    total: 0,
  },
  sort: {
    sortField: 'arrivalDate', // поле для сортування за замовчуванням
    sortOrder: 'asc', // порядок сортування за замовчуванням
  },
  filters: {
    id: '',
    invoiceNumber: '',
    arrivalDate: '',
    vehicleNumber: '',
    physicalWeight: '',
    supplierTitle: '',
    productTitle: '',
    createdByName: '',
    page: 1,
    size: 10,
  },
  selectedInvoice: null,
  isModalOpen: false,
};

const inputInvoiceSlice = createSlice({
  name: 'inputInvoice',
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
      // Fetch Invoices
      .addCase(fetchInvoices.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchInvoices.fulfilled, (state, action) => {
        state.invoices = action.payload.data;
        state.pagination.total = action.payload.total;
        state.loading = false;
      })
      .addCase(fetchInvoices.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create Invoice
      .addCase(createInvoice.fulfilled, (state) => {
        state.isModalOpen = false;
      })
      // Update Invoice
      .addCase(updateInvoice.fulfilled, (state) => {
        state.isModalOpen = false;
      })
      // Delete Invoice
      .addCase(deleteInvoice.fulfilled, (state, action) => {
		const deletedId = action.meta.arg; // отримання ID з deleteInvoice
		state.invoices = state.invoices.filter((invoice) => invoice.id !== deletedId); // видалення зі списку
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
} = inputInvoiceSlice.actions;

export default inputInvoiceSlice.reducer;

