import './App.css'
import React from 'react';
import { message } from 'antd';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
//import { Outlet } from 'react-router-dom'
import Home from "./pages/Home";
import OutputInvoices from './pages/OutputInvoicePage';
import InputInvoices from './pages/InputInvoicePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegistrationPage';
import Header from './components/Header/Header';
import { Outlet } from 'react-router-dom'

message.config({
    top: 300, // відступ зверху
    duration: 3, // тривалість у секундах
});

function App() {
    return (
        // <>
		// 	<Header />
        //     <Routes>
		// 		<Route path="/" element={<Home />} />
		// 		<Route path="/login" element={<LoginPage />} />
		// 		<Route path="/register" element={<RegisterPage />} />
		// 		<Route path="/input-invoices" element={<InputInvoices />} />
        //         <Route path="/output-invoices" element={<OutputInvoices />} />
		// 		<Route path="*" element={<h1>Page not found</h1>} />
        //     </Routes>
        // </>

		<div>
			<Header />
			<Outlet />

			
		</div>
    );
}

export default App;

