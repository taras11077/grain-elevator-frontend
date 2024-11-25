import api from '../api/axios';

// Реєстрація
export const register = async (email, password, roleId) => {
  const response = await api.post('/api/auth/register', {
    email,
    password,
    roleId,
  });
  return response.data;
};

// Логін
export const login = async (email, password) => {
	try {
		const response = await api.post('api/auth/login', { email, password });
		return response.data;
	} catch (error) {
		console.error('Помилка авторизації:', error.response?.data || error.message);
		throw error;
	}
  };
