import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export type CartItem = { id: string; name: string; price: number; quantity: number }
type OrderData = { address: string; paymentMethod: string }

export const createOrder = createAsyncThunk<unknown, OrderData, { rejectValue: string }>(
  'cart/createOrder',
  async (orderData, { getState, rejectWithValue }) => {
    try {
      const { cartItems } = (getState() as { cart: { cartItems: CartItem[] } }).cart;

      const response = await fetch(`${API_URL}/createorder`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          items: cartItems.map(item => ({
            product: item.id,
            quantity: item.quantity,
          })),
          shippingAddress: orderData.address,
          paymentMethod: orderData.paymentMethod,
        }),
      });
      const data = await response.json();
      if (!response.ok) return rejectWithValue(data.message);
      return data;
    } catch {
      return rejectWithValue('Could not reach the server');
    }
  }
);

const initialState = {
  cartItems: JSON.parse(localStorage.getItem('cart') || '[]') as CartItem[],
  loading: false,
  error: null as string | null,
  orderSuccess: false,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<Omit<CartItem, 'quantity'>>) => {
      const existingItem = state.cartItems.find(item => item.id === action.payload.id);
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.cartItems.push({ ...action.payload, quantity: 1 });
      }
      localStorage.setItem('cart', JSON.stringify(state.cartItems));
    },
    removeFromCart: (state, action: PayloadAction<string>) => {
      state.cartItems = state.cartItems.filter(item => item.id !== action.payload);
      localStorage.setItem('cart', JSON.stringify(state.cartItems));
    },
    updateQuantity: (state, action: PayloadAction<{ id: string; quantity: number }>) => {
      const { id, quantity } = action.payload;
      const item = state.cartItems.find(item => item.id === id);
      if (item && Number.isInteger(quantity) && quantity > 0) {
        item.quantity = quantity;
      }
      localStorage.setItem('cart', JSON.stringify(state.cartItems));
    },
    clearCart: (state) => {
      state.cartItems = [];
      localStorage.removeItem('cart');
    },
    clearOrderState: (state) => {
      state.orderSuccess = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.orderSuccess = false;
      })
      .addCase(createOrder.fulfilled, (state) => {
        state.loading = false;
        state.orderSuccess = true;
        state.cartItems = [];
        localStorage.removeItem('cart');
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? 'Order failed';
        state.orderSuccess = false;
      });
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart, clearOrderState } = cartSlice.actions;
export default cartSlice.reducer;