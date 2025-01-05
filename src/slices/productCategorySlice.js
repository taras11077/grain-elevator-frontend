import { createSlice } from '@reduxjs/toolkit'
import { fetchProductCategories } from '../asyncThunks/productCategoryThunk'

const initialState = {
  productCategories: [],
  loading: false,
  error: null,
};

const productCategorySlice = createSlice({
  name: 'productCategories',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProductCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.productCategories = action.payload;
      })
      .addCase(fetchProductCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default productCategorySlice.reducer;