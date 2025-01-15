import { createSlice } from '@reduxjs/toolkit'
import {
	createEmployee,
	deleteEmployee,
	fetchEmployees,
	updateEmployee,
} from '../asyncThunks/employeeThunk'

const initialState = {
employees: [],
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
selectedEmployee: null,
isModalOpen: false,
loading: false,
error: null,
};

const employeeSlice = createSlice({
  name: 'employees',
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
	  setSelectedEmployee(state, action) {
		state.selectedEmployee = action.payload;
	  },
	  toggleModal(state, action) {
		state.isModalOpen = action.payload;
	  },

  },
  extraReducers: (builder) => {
    builder
		// Fetch Employees
		.addCase(fetchEmployees.pending, (state) => {
			state.loading = true;
			state.error = null;
		})
		.addCase(fetchEmployees.fulfilled, (state, action) => {
			state.employees = action.payload.data || [];
			state.pagination.total = action.payload.total;
			state.loading = false;
		})
		.addCase(fetchEmployees.rejected, (state, action) => {
			state.loading = false;
			state.error = action.payload;
		})
		// Create Employee
		.addCase(createEmployee.fulfilled, (state) => {
			state.isModalOpen = false;
		})
	
		// Update Employee
		.addCase(updateEmployee.fulfilled, (state) => {
			state.isModalOpen = false;
			state.error = null;
		})
		.addCase(updateEmployee.rejected, (state, action) => {
			state.loading = false;
			// якщо сервер повернув дані про помилку, зберігаємо їх
			if (action.payload) {
				state.error = action.payload.message || 'Помилка оновлення Даних співробітника.';
			} else {
				//у разі інших помилок
				state.error = 'Виникла непередбачена помилка.';
			}
		})
		

		// Delete Employee
		.addCase(deleteEmployee.fulfilled, (state, action) => {
			const deletedId = action.meta.arg; // отримання ID з deleteEmployee
			state.employees = state.employees.filter((employee) => employee.id !== deletedId);// видалення зі списку
			state.pagination.total -= 1;// оновлення загальної кількості
		});
	},
});
	
	export const {
	setFilters,
	setPagination,
	setSort,
	setSelectedEmployee,
	toggleModal,
	} = employeeSlice.actions;

export default employeeSlice.reducer;