import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ObjectId } from 'mongodb';
import { CartItem, Product } from '@/types';

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  addItem: (product: Product, quantity?: number, size?: string, color?: string) => void;
  removeItem: (productId: string | ObjectId) => void;
  updateQuantity: (productId: string | ObjectId, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (product, quantity = 1, size, color) => {
        const items = get().items;
        const productIdStr = String(product._id);
        const existingItem = items.find(
          (item) => String(item.product._id) === productIdStr && 
          item.selectedSize === size && 
          item.selectedColor === color
        );

        if (existingItem) {
          set({
            items: items.map((item) =>
              String(item.product._id) === productIdStr &&
              item.selectedSize === size &&
              item.selectedColor === color
                ? { ...item, quantity: item.quantity + quantity }
                : item
            ),
          });
        } else {
          set({
            items: [...items, { product, quantity, selectedSize: size, selectedColor: color }],
          });
        }
      },

      removeItem: (productId) => {
        const idStr = String(productId);
        set({
          items: get().items.filter((item) => String(item.product._id) !== idStr),
        });
      },

      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }
        const idStr = String(productId);
        set({
          items: get().items.map((item) =>
            String(item.product._id) === idStr ? { ...item, quantity } : item
          ),
        });
      },

      clearCart: () => {
        set({ items: [] });
      },

      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      getTotalPrice: () => {
        return get().items.reduce(
          (total, item) => total + item.product.price * item.quantity,
          0
        );
      },

      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set({ isOpen: !get().isOpen }),
    }),
    {
      name: 'auntie-araba-cart',
    }
  )
);
