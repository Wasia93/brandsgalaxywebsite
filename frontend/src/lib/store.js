import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],

      // variantPrice: the actual price for the selected size (overrides product base price)
      addItem: (product, quantity = 1, selectedSize = null, variantPrice = null) => set((state) => {
        const cartKey = selectedSize ? `${product.id}-${selectedSize}` : product.id;
        const existingItem = state.items.find(item => item.cartKey === cartKey);

        if (existingItem) {
          return {
            items: state.items.map(item =>
              item.cartKey === cartKey
                ? { ...item, quantity: Math.min(item.quantity + quantity, product.stock_quantity) }
                : item
            )
          };
        }

        return {
          items: [...state.items, {
            ...product,
            cartKey,
            selectedSize,
            variantPrice,   // stored so cart calculations use the correct size price
            quantity: Math.min(quantity, product.stock_quantity),
          }]
        };
      }),

      removeItem: (cartKey) => set((state) => ({
        items: state.items.filter(item => item.cartKey !== cartKey)
      })),

      updateQuantity: (cartKey, quantity) => set((state) => ({
        items: state.items.map(item =>
          item.cartKey === cartKey
            ? { ...item, quantity: Math.min(Math.max(quantity, 0), item.stock_quantity) }
            : item
        ).filter(item => item.quantity > 0)
      })),

      clearCart: () => set({ items: [] }),

      getTotal: () => {
        const { items } = get();
        return items.reduce((total, item) => {
          // Use variant price if set, otherwise fall back to discount/base price
          const price = item.variantPrice ?? item.discount_price ?? item.price;
          return total + (Number(price) * item.quantity);
        }, 0);
      },

      getItemCount: () => {
        const { items } = get();
        return items.reduce((count, item) => count + item.quantity, 0);
      },

      getSubtotal: () => get().getTotal(),
      // Shipping and tax are city-dependent — calculated properly in checkout.
      // These are estimates used in cart summary (assumes Karachi rate).
      getShipping: () => get().getSubtotal() >= 5000 ? 0 : 350,
      getTax: () => {
        const base = get().getSubtotal() + get().getShipping();
        return Math.round(base * 0.04);
      },
      getGrandTotal: () => get().getSubtotal() + get().getShipping() + get().getTax(),
    }),
    { name: 'cart-storage' }
  )
);

export const useWishlistStore = create(
  persist(
    (set, get) => ({
      items: [],
      toggleItem: (product) => set((state) => {
        const exists = state.items.find(i => i.id === product.id);
        return exists
          ? { items: state.items.filter(i => i.id !== product.id) }
          : { items: [...state.items, product] };
      }),
      isWishlisted: (id) => get().items.some(i => i.id === id),
      getCount: () => get().items.length,
    }),
    { name: 'wishlist-storage' }
  )
);

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      setAuth: (user, token) => set({ user, token }),
      logout: () => set({ user: null, token: null }),
      isAuthenticated: () => !!useAuthStore.getState().token,
    }),
    { name: 'auth-storage' }
  )
);
