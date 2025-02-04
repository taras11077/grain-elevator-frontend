import { message } from 'antd'
import axios from 'axios'
import { store } from '../app/store'
import { logout } from '../asyncThunks/authThunk'


const apiBaseUrl =
  window.location.hostname === "localhost"
    ? "https://localhost:7187/api"
    : "http://grainelevator.cloud/api";


//console.log("API URL:", process.env.REACT_APP_API_URL);
console.log("API URL:", apiBaseUrl);

const api = axios.create({
    //baseURL: process.env.REACT_APP_API_URL,
	baseURL: apiBaseUrl,
	withCredentials: true,
    headers: {
        'Content-Type': 'application/json'
    }
});

console.log("Axios API URL:", api.defaults.baseURL);

// Додавання токена перед кожним запитом
api.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
}, error => {
    return Promise.reject(error);
});

// Інтерцептор для обробки відповіді
api.interceptors.response.use(
	(response) => response, // успішна відповідь
	(error) => {
	  if (error.response?.status === 401) {
		// видалення токена з Redux і локального сховища
		store.dispatch(logout());
		localStorage.removeItem('token');
  
		message.error('Сесія завершилася. Будь ласка, увійдіть у систему знову.');
  
		// перенаправлення користувача на сторінку авторизації
		window.location.href = '/';
	  }
	  return Promise.reject(error); // продовження обробку помилки
	}
  );

export default api;
