import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

// Helper for API URL
const getBaseUrl = () => import.meta.env.VITE_API_URL;
const getHeaders = () => {
  const token = (sessionStorage.getItem("authToken") || localStorage.getItem("authToken")) || localStorage.getItem("authToken");
  return { headers: { Authorization: `Token ${token}` } };
};

// --- Async Thunk to Fetch Cart ---
export const fetchCartData = createAsyncThunk(
  "cart/fetchCartData",
  async (_, { rejectWithValue }) => {
    try {
      const token = (sessionStorage.getItem("authToken") || localStorage.getItem("authToken"));
      if (!token) {
        // If no token, we load from localStorage instead of API
        const localCart = localStorage.getItem("guestCart");
        if (localCart) {
          return JSON.parse(localCart);
        }
        return { items: [], total_price: "0.00" };
      }

      const baseUrl = getBaseUrl();
      const res = await axios.get(`${baseUrl}/api/vending/cart/`, {
        headers: { Authorization: `Token ${token}` }
      });
      return res.data;
    } catch (err: any) {
      console.error("Error fetching cart from API", err);
      return rejectWithValue(err.response?.data || "Failed to fetch cart");
    }
  }
);

interface CartState {
  items: any[];
  totalQuantity: number;
  loading: boolean;
  error: string | null;
}

const initialState: CartState = {
  items: [],
  totalQuantity: 0,
  loading: false,
  error: null,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    clearCart: (state) => {
      state.items = [];
      state.totalQuantity = 0;
      state.error = null;
      localStorage.removeItem("guestCart");
    },
    syncLocalCart: (state, action: PayloadAction<any[]>) => {
      state.items = action.payload;
      state.totalQuantity = action.payload.reduce(
        (acc: number, item: any) => acc + (item.quantity || 1),
        0
      );
      const token = sessionStorage.getItem("authToken") || localStorage.getItem("authToken");
      if (!token) {
        // Read existing guest cart to preserve location_id, plan_type, etc.
        const existingData = localStorage.getItem("guestCart");
        let guestCartObj = { items: state.items };
        if (existingData) {
          try {
            guestCartObj = { ...JSON.parse(existingData), items: state.items };
          } catch (err) { }
        }
        localStorage.setItem("guestCart", JSON.stringify(guestCartObj));
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCartData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCartData.fulfilled, (state, action) => {
        state.loading = false;
        const apiCart = action.payload;
        state.items = apiCart?.items || [];

        if (state.items.length > 0) {
          state.totalQuantity = state.items.reduce(
            (acc: number, item: any) => acc + (item.quantity || 1),
            0
          );
        } else {
          state.totalQuantity = 0;
        }
      })
      .addCase(fetchCartData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearCart, syncLocalCart } = cartSlice.actions;

export const selectTotalCartItems = (state: any) => state.cart.totalQuantity;
export const selectCartLoading = (state: any) => state.cart.loading;

export default cartSlice.reducer;
