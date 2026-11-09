import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

type Product = { id: string; name: string; price: number; image?: string; category?: string; description?: string }
type FetchParams = { search?: string; category?: string; page?: number }

export const fetchProducts = createAsyncThunk<{ products: Product[]; pages: number; page: number }, FetchParams | undefined, { rejectValue: string }>(
  'products/fetchProducts',
  async (params = {}, { rejectWithValue }) => {
    try {
      const { search, category, page } = params;

      const query = new URLSearchParams();
      if (search) query.append('search', search);
      if (category && category !== 'all') query.append('category', category);
      if (page) query.append('page', String(page));

      const response = await fetch(`${API_URL}/getproducts?${query}`);
      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data.message);
      }

      return {
        ...data,
        products: data.products.map((product: Product & { _id?: string }) => ({
          ...product,
          id: product._id || product.id,
        })),
      };
    } catch {
      return rejectWithValue('Unable to connect to the server');
    }
  }
);

export const fetchProductById = createAsyncThunk<Product,string,{ rejectValue: string }>(
  'products/fetchProductById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/getproducts/${id}`);
      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data.message);
      }

      return {
        ...data,
        id: data._id || data.id,
      };
    } catch {
      return rejectWithValue('Unable to connect to the server');
    }
  }
);

const initialState = {
  products: [] as Product[],
  selectedProduct: null as Product | null,
  totalPages: 1,
  currentPage: 1,
  loading: false,
  error: null as string | null,
  searchQuery: '',
  category: 'all',
};

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    setCategory: (state, action: PayloadAction<string>) => {
      state.category = action.payload;
    },
    clearSelectedProduct: (state) => {
      state.selectedProduct = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.products;
        state.totalPages = action.payload.pages;
        state.currentPage = action.payload.page;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? 'Failed to load products';
      })
      .addCase(fetchProductById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedProduct = action.payload;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? 'Failed to load product';
      });
  },
});

export const { setSearchQuery, setCategory, clearSelectedProduct } = productSlice.actions;
export default productSlice.reducer;