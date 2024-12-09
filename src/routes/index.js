import InputInvoice from '../pages/InputInvoicePage';
import OutputInvoice from '../pages/OutputInvoicePage';
import Registration from '../pages/RegistrationPage';
import Login from '../pages/LoginPage';
import Home from '../pages/Home';
import { createBrowserRouter } from 'react-router-dom';
import App from '../App';
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
			element: <PrivateRoute> <InputInvoice /> </PrivateRoute>
		  },
		   {
			path: '/output-invoices',
			element: <OutputInvoice />
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
			element: <h1>Page not found</h1>
		   }
	  ]
	},
  ]);

  export default router;