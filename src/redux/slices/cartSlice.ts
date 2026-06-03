import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

// Helper for API URL
const getBaseUrl = () => import.meta.env.VITE_API_URL;
const getHeaders = () => {
  const token = (sessionStorage.getItem("authToken") || localStorage.getItem("authToken")) || localStorage.getItem("authToken");
  return { headers: { Authorization: `Token ${token}` } };
};

// Beit Nahla items live entirely on the client: the vending CartItem model
// has no FK for BEIT_NAHLA boxes, so they can't be persisted server-side
// without a migration. We keep them in a separate localStorage key and merge
// them into the cart's items array on every load.
const readBeitNahlaItems = (): any[] => {
  try {
    const raw = localStorage.getItem("beitNahlaCart");
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed?.items) ? parsed.items : [];
  } catch {
    return [];
  }
};

// --- Async Thunk to Fetch Cart ---
export const fetchCartData = createAsyncThunk(
  "cart/fetchCartData",
  async (_, { rejectWithValue }) => {
    try {
      const token = (sessionStorage.getItem("authToken") || localStorage.getItem("authToken"));
      const beitNahlaItems = readBeitNahlaItems();

      if (!token) {
        // If no token, we load from localStorage instead of API
        const localCart = localStorage.getItem("guestCart");
        const base = localCart
          ? JSON.parse(localCart)
          : { items: [], total_price: "0.00" };
        // Merge Beit Nahla items in (guestCart already includes them if the
        // last cart sync was a Beit Nahla one, but dedupe by id+plan_type).
        const seen = new Set(
          (base.items || []).map(
            (i: any) => `${i.plan_type || ""}:${i.menu_item?.id || i.id}`,
          ),
        );
        for (const bn of beitNahlaItems) {
          const k = `${bn.plan_type || "BEIT_NAHLA"}:${bn.menu_item?.id || bn.id}`;
          if (!seen.has(k)) {
            base.items = [...(base.items || []), bn];
            seen.add(k);
          }
        }
        return base;
      }

      const baseUrl = getBaseUrl();
      const res = await axios.get(`${baseUrl}/api/vending/cart/`, {
        headers: { Authorization: `Token ${token}` }
      });
      // Merge Beit Nahla items (backend doesn't store them).
      const apiData = res.data || { items: [] };
      const seen = new Set(
        (apiData.items || []).map(
          (i: any) => `${i.plan_type || ""}:${i.menu_item?.id || i.id}`,
        ),
      );
      for (const bn of beitNahlaItems) {
        const k = `${bn.plan_type || "BEIT_NAHLA"}:${bn.menu_item?.id || bn.id}`;
        if (!seen.has(k)) {
          apiData.items = [...(apiData.items || []), bn];
          seen.add(k);
        }
      }
      return apiData;
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
      localStorage.removeItem("beitNahlaCart");
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
