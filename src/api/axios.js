import { message } from 'antd'
import axios from 'axios'
import { store } from '../app/store'
import { logout } from '../asyncThunks/authThunk'

const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
	withCredentials: true,
    headers: {
        'Content-Type': 'application/json'
    }
});

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
