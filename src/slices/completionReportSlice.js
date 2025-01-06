import { createSlice } from '@reduxjs/toolkit';
import {
fetchCompletionReports,
  createCompletionReport,
  updateCompletionReport,
  deleteCompletionReport,
} from '../asyncThunks/completionReportThunk';

const initialState = {
	reports: [],
	pagination: { current: 1, pageSize: 10, total: 0 },
	filters: {
		reportNumber: '',
		reportDate: '',
		supplierTitle: '',
		productTitle: '',
		createdByName: '',
	  },
  sort: {
	sortField: 'reportDate', // поле для сортування за замовчуванням
	sortOrder: 'asc', // порядок сортування за замовчуванням
  },
  selectedReport: null,
  selectedRegisterIds: [],
  selectedOperationIds: [],
  isModalOpen: false,
  loading: false,
  error: null,
};

const completionReportSlice = createSlice({
  name: 'completionReport',
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
	setSelectedReport(state, action) {
	  state.selectedReport = action.payload;
	},
	clearSelectedReport: (state) => {
		state.selectedReport = null;
	  },
	setSelectedRegisterIds(state, action) {
		state.selectedRegisterIds = action.payload;
	},
	clearSelectedRegisterIds(state) {
		state.selectedRegisterIds = [];
	},
	setSelectedOperationIds(state, action) {
		state.selectedOperationIds = action.payload;
	},
	clearSelectedOperationIds(state) {
		state.selectedOperationIds = [];
	},
	toggleModal(state, action) {
	  state.isModalOpen = action.payload;
	},
  },
  extraReducers: (builder) => {
	builder
	  // Fetch completionReports
	  .addCase(fetchCompletionReports.pending, (state) => {
		state.loading = true;
	  })
	  .addCase(fetchCompletionReports.fulfilled, (state, action) => {
		state.reports = action.payload.data || [];
		state.pagination.total = action.payload.total;
		state.loading = false;
	  })
	  .addCase(fetchCompletionReports.rejected, (state, action) => {
		state.loading = false;
		state.error = action.payload;
	  })
	  // Create completionReport
	  .addCase(createCompletionReport.fulfilled, (state) => {
		state.isModalOpen = false;
	  })
	  // Update completionReport
	  .addCase(updateCompletionReport.fulfilled, (state) => {
		state.isModalOpen = false;
	  })
	  // Delete completionReport
	  .addCase(deleteCompletionReport.fulfilled, (state, action) => {
		const deletedId = action.meta.arg; // отримання ID з deleteCompletionReport
		state.reports = state.reports.filter((report) => report.id !== deletedId); // видалення зі списку
		state.pagination.total -= 1; // оновлення загальної кількості
	});
  },
});


export const {
  setFilters,
  setPagination,
  setSort,
  setSelectedReport,
  clearSelectedReport,
  setSelectedRegisterIds,
  clearSelectedRegisterIds,
  setSelectedOperationIds,
  clearSelectedOperationIds,
  toggleModal,
} = completionReportSlice.actions;

export default completionReportSlice.reducer;