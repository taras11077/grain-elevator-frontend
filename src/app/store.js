import { configureStore } from '@reduxjs/toolkit';
import authReducer from "../slices/authSlice";
import roleReducer from "../slices/roleSlice";
import inputInvoiceReducer from '../slices/inputInvoiceSlice';
import laboratoryCardReducer from '../slices/laboratoryCardSlice';
import invoiceRegisterReducer from '../slices/invoiceRegisterSlice';
import outputInvoiceReducer from '../slices/outputInvoiceSlice';
import warehouseReducer from '../slices/warehouseSlice';

export const store = configureStore({
	reducer: {
		auth: authReducer,
		roles: roleReducer,
		inputInvoice: inputInvoiceReducer,
		laboratoryCards: laboratoryCardReducer,
		registers: invoiceRegisterReducer,
		outputInvoices: outputInvoiceReducer,
		warehouse: warehouseReducer,
	}
});
