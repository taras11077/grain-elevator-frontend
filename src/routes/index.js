import { createBrowserRouter } from 'react-router-dom'
import App from '../App'
import Home from '../pages/Home'
import InputInvoice from '../pages/InputInvoicePage'
import Login from '../pages/LoginPage'
import OutputInvoice from '../pages/OutputInvoicePage'
import Registration from '../pages/RegistrationPage'
import PrivateRoute from './PrivateRoute'
import NotFoundPage from '../pages/NotFoundPage';
import Forbidden from '../pages/Forbidden'


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
  ]);

  export default router;