import { createBrowserRouter } from 'react-router-dom'
import App from '../App'
import CompletionReport from '../pages/CompletionReportPage'
import Employee from '../pages/EmployeePage'
import Forbidden from '../pages/Forbidden'
import Home from '../pages/Home'
import InputInvoice from '../pages/InputInvoicePage'
import InvoiceRegister from '../pages/InvoiceRegisterPage'
import LaboratoryCard from '../pages/LaboratoryCardPage'
import NotFoundPage from '../pages/NotFoundPage'
import OutputInvoice from '../pages/OutputInvoicePage'
import PriceList from '../pages/PriceListPage'
import Supplier from '../pages/SupplierPage'
import Product from '../pages/ProductPage'
import Registration from '../pages/RegistrationPage'
import Role from '../pages/RolePage'
import TechnologicalOperation from '../pages/TechnologicalOperationPage'
import Warehouse from '../pages/WarehousePage'
import Statistic from '../pages/StatisticPage'
import PrivateRoute from './PrivateRoute'

const router = createBrowserRouter([
	{
	  path: "/",
	  element: <App />,
	  children: [
		{
			index: true,
			element: <Home />,
		  },
		{
			path: '/home',
			element: <Home />
		  },

		  {
			path: '/input-invoices',
			element:
				<PrivateRoute allowedRoles={['Laboratory', 'Admin', 'CEO']}>
					<InputInvoice />
				</PrivateRoute>
			  
		  },
		  {
			path: '/laboratory-cards',
			element:
				<PrivateRoute allowedRoles={['Laboratory', 'Admin', 'CEO','Technologist']}>
					<LaboratoryCard />
				</PrivateRoute>		  
		  },
		  {
			path: '/register',
			element:
				<PrivateRoute allowedRoles={['Technologist', 'Admin', 'CEO']}>
					<InvoiceRegister />
				</PrivateRoute>			  
		  },

		  {
			path: '/technological-operation',
			element:
				<PrivateRoute allowedRoles={['Technologist', 'Accountant', 'Admin', 'CEO']}>
					<TechnologicalOperation />
				</PrivateRoute>
		  },

		  {
			path: '/completion-report',
			element:
				<PrivateRoute allowedRoles={['Technologist', 'Accountant', 'Admin', 'CEO']}>
					<CompletionReport />
				</PrivateRoute>  
		  },

		  {
			path: '/price-list',
			element:
				<PrivateRoute allowedRoles={['Accountant', 'Admin', 'CEO']}>
					<PriceList />
				</PrivateRoute>  
		  },

		  {
			path: '/warehouse',
			element:
				<PrivateRoute allowedRoles={['Accountant', 'Admin', 'CEO']}>
					<Warehouse />
				</PrivateRoute>			  
		  },

		  {
			path: '/output-invoices',
			element:
				<PrivateRoute allowedRoles={['Accountant', 'Admin', 'CEO']}>
					<OutputInvoice />
				</PrivateRoute>			  
		  },
		
		  {
			path: '/suppliers',
			element:
			<PrivateRoute allowedRoles={['Technologist', 'Laboratory', 'Accountant', 'Admin', 'CEO']}>
				<Supplier />
			</PrivateRoute>
		  },

		  {
			path: '/products',
			element:
			<PrivateRoute allowedRoles={['Technologist', 'Laboratory', 'Accountant', 'Admin', 'CEO']}>
				<Product />
			</PrivateRoute>
		  },

		  {
			path: '/employee',
			element:
				<PrivateRoute allowedRoles={['HR', 'Admin', 'CEO']}>
					<Employee />
				</PrivateRoute>			  
		  },

		  {
			path: '/role',
			element:
				<PrivateRoute allowedRoles={['HR', 'Admin', 'CEO']}>
					<Role />
				</PrivateRoute>			  
		  },

		  {
			path: '/statistic',
			element:
				<PrivateRoute allowedRoles={['Admin', 'CEO']}>
					<Statistic />
				</PrivateRoute>			  
		  },


		  {
			path: '/registration',
			element: <Registration />
		  },
		   {
			path: "*",
			element: <NotFoundPage />
		   },
		   {
			path:"/forbidden",
			element: <Forbidden />
		   },
	  ]
	},
  ],
  {
    future: {
      v7_startTransition: true, // опція для `startTransition`
      v7_relativeSplatPath: true, // опція для зміни відносних маршрутів
      v7_fetcherPersist: true, // опція для поведінки fetchers
      v7_normalizeFormMethod: true, // опція для нормалізації методів форм
      v7_partialHydration: true, // опція для часткової гідратації
      v7_skipActionErrorRevalidation: true, // опція для обробки помилок дій
    },
  }
);

  export default router;