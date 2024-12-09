import './App.css'
import React from 'react';
import { message } from 'antd';
import Header from './components/Header/Header';
import { Outlet } from 'react-router-dom'

message.config({
    top: 300, // відступ зверху
    duration: 3, // тривалість у секундах
});

function App() {
    return (
		<div>
			<Header />
			<Outlet />
		</div>
    );
}

export default App;

