import axios from 'axios';
import { message } from 'antd'
import { logout } from '../asyncThunks/authThunk'
import { store } from '../app/store'

const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
	withCredentials: true,
    headers: {
        'Content-Type': 'application/json'
    }
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
