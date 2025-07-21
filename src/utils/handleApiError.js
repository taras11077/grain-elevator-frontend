// універсальна функція обробки помилок для createAsyncThunk
export function handleApiError(error, rejectWithValue) {
  if (error.response && error.response.data) {
    return rejectWithValue(error.response.data);
  }
  return rejectWithValue({ message: error.message || 'Помилка запиту до сервера' });
}
