import { createSlice } from '@reduxjs/toolkit';
import { 
	fetchRoles,
	createRole,
	deleteRole,
	updateRole,
 } from '../asyncThunks/roleThunk'

const initialState = {
roles: [],
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
selectedRole: null,
isModalOpen: false,
loading: false,
error: null,
};

const roleSlice = createSlice({
  name: 'roles',
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
	  setSelectedRole(state, action) {
		state.selectedRole = action.payload;
	  },
	  toggleModal(state, action) {
		state.isModalOpen = action.payload;
	  },

  },
  extraReducers: (builder) => {
	builder
		// Fetch roles
		.addCase(fetchRoles.pending, (state) => {
			state.loading = true;
			state.error = null;
		})
		.addCase(fetchRoles.fulfilled, (state, action) => {
			state.roles = action.payload.data || [];
			state.pagination.total = action.payload.total;
			state.loading = false;
		})
		.addCase(fetchRoles.rejected, (state, action) => {
			state.loading = false;
			state.error = action.payload;
		})
		// Create Role
		.addCase(createRole.fulfilled, (state) => {
			state.isModalOpen = false;
		})
	
		// Update Role
		.addCase(updateRole.fulfilled, (state) => {
			state.isModalOpen = false;
		})
		.addCase(updateRole.rejected, (state, action) => {
			state.loading = false;
			// якщо сервер повернув дані про помилку, зберігаємо їх
			if (action.payload) {
				state.error = action.payload.message || 'Помилка оновлення Ролі.';
			} else {
				//у разі інших помилок
				state.error = 'Виникла непередбачена помилка.';
			}
		})
		
		// Delete Role
		.addCase(deleteRole.fulfilled, (state, action) => {
			const deletedId = action.meta.arg; // отримання ID з deleteRole
			state.roles = state.roles.filter((Role) => Role.id !== deletedId);// видалення зі списку
			state.pagination.total -= 1;// оновлення загальної кількості
		});
	},
});
	
	export const {
	setFilters,
	setPagination,
	setSort,
	setSelectedRole,
	toggleModal,
	} = roleSlice.actions;

export default roleSlice.reducer;

