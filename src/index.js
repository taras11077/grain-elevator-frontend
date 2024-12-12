import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import { Provider } from 'react-redux';
import { store } from './app/store';
import { RouterProvider } from 'react-router-dom';
import router from './routes'
import { fetchUserData } from './asyncThunks/authThunk'
import { getToken } from './utils/tokenHelperFunctions'

const root = ReactDOM.createRoot(document.getElementById('root'));

if (getToken()) {
	store.dispatch(fetchUserData());
}

root.render(
  <React.StrictMode>
		<Provider store={store}>
			<RouterProvider router={router} />
		</Provider>
   </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
