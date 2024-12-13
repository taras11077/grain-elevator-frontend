import { createBrowserRouter } from 'react-router-dom'
import App from '../App'
import Forbidden from '../pages/Forbidden'
import Home from '../pages/Home'
import InputInvoice from '../pages/InputInvoicePage'
import Login from '../pages/LoginPage'
import NotFoundPage from '../pages/NotFoundPage'
import OutputInvoice from '../pages/OutputInvoicePage'
import Registration from '../pages/RegistrationPage'
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
			path: '/output-invoices',
			element:
			<PrivateRoute allowedRoles={['Accountant', 'Admin', 'CEO']}>
				<OutputInvoice />
			</PrivateRoute>

		  },
		  {
			path: '/registration',
			element: <Registration />
		  },
		  {
			path: '/login',
			element: <Login />
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