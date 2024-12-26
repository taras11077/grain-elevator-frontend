import { createSlice } from '@reduxjs/toolkit'
import {
	createRegister,
	deleteRegister,
	fetchRegisters,
	updateRegister,
} from '../asyncThunks/invoiceRegisterThunk'

const initialState = {
  registers: [],
  pagination: { current: 1, pageSize: 10, total: 0 },
  filters: {
	registerNumber: '',
	arrivalDate: '',
	productTitle: '',
	supplierTitle: '',
	physicalWeightReg: '',
	accWeightReg: '',
	createdByName: '',
	page: 1,
	size: 10,
  },
  sort: {
	sortField: 'arrivalDate',
	sortOrder: 'asc',
  },
  selectedRegister: null,
  isModalOpen: false,
  loading: false,
  error: null,
};

const invoiceRegisterSlice = createSlice({
  name: 'invoiceRegisters',
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
	setSelectedRegister(state, action) {
	  state.selectedRegister = action.payload;
	},
	toggleModal(state, action) {
	  state.isModalOpen = action.payload;
	},
  },
  extraReducers: (builder) => {
	builder
	  // Fetch Registers
	  .addCase(fetchRegisters.pending, (state) => {
		state.loading = true;
	  })
	  .addCase(fetchRegisters.fulfilled, (state, action) => {
		state.registers = action.payload.data;
		state.pagination.total = action.payload.total;
		state.loading = false;
	  })
	  .addCase(fetchRegisters.rejected, (state, action) => {
		state.loading = false;
		state.error = action.error.message;
	  })

	  // Create Register
	  .addCase(createRegister.fulfilled, (state) => {
		state.isModalOpen = false;
	  })

	  // Update Register
	  .addCase(updateRegister.fulfilled, (state, action) => {
		state.loading = false;
		state.error = null; //успішне оновлення, помилок немає

			//пошук картки та її оновлення
		const index = state.registers.findIndex((reg) => reg.id === action.payload.id);
		if (index !== -1) {
		  state.registers[index] = { ...state.registers[index], ...action.payload };
		}
	  })

	  .addCase(updateRegister.rejected, (state, action) => {
		state.loading = false;

		// якщо сервер повернув дані про помилку, зберігаємо їх
		if (action.payload) {
		  state.error = action.payload.message || 'Помилка оновлення Реєстру.';
		} else {
		  //у разі інших помилок
		  state.error = 'Виникла непередбачена помилка.';
		}
	  })

	  // Delete Register
	  .addCase(deleteRegister.fulfilled, (state, action) => {
		state.registers = state.registers.filter(
		  (reg) => reg.id !== action.payload
		);
		state.pagination.total -= 1;
	  });
  },
});

export const {
  setFilters,
  setPagination,
  setSort,
  setSelectedRegister,
  toggleModal,
} = invoiceRegisterSlice.actions;

export default invoiceRegisterSlice.reducer;