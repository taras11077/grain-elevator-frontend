import { configureStore } from '@reduxjs/toolkit';
import authReducer from "../slices/authSlice";
import roleReducer from "../slices/roleSlice";
import inputInvoiceReducer from '../slices/inputInvoiceSlice';
import laboratoryCardReducer from '../slices/laboratoryCardSlice';
import invoiceRegisterReducer from '../slices/invoiceRegisterSlice';
import completionReportReducer from '../slices/completionReportSlice';
import outputInvoiceReducer from '../slices/outputInvoiceSlice';
import warehouseReducer from '../slices/warehouseSlice';
import supplierReducer from '../slices/supplierSlice';
import productReducer from '../slices/productSlice';
import productCategoryReducer from '../slices/productCategorySlice';

export const store = configureStore({
	reducer: {
		auth: authReducer,
		roles: roleReducer,
		inputInvoice: inputInvoiceReducer,
		laboratoryCards: laboratoryCardReducer,
		registers: invoiceRegisterReducer,
		reports: completionReportReducer,
		outputInvoices: outputInvoiceReducer,
		warehouse: warehouseReducer,
		suppliers: supplierReducer,
		products: productReducer,
		productCategories: productCategoryReducer,
	}
});
