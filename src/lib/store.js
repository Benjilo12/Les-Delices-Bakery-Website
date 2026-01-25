import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { toast } from "sonner";

export const useStore = create(
  persist(
    (set, get) => ({
      // ========== CART STATE ==========
      cart: [],
      cartOpen: false,

      addToCart: (
        product,
        priceOption,
        quantity = 1,
        customization = "",
        flavor = "",
      ) => {
        const cart = get().cart;

        // Create a unique ID for this specific variation (Product + Size + Flavor)
        const variationId = `${product._id}-${priceOption.label}-${flavor}`;

        const existingItemIndex = cart.findIndex(
          (item) => item.cartItemId === variationId,
        );

        if (existingItemIndex >= 0) {
          const updatedCart = [...cart];
          updatedCart[existingItemIndex].quantity += quantity;

          // Update customization only if new notes are provided
          if (customization) {
            updatedCart[existingItemIndex].customizationNotes = customization;
          }

          set({ cart: updatedCart });
          toast.success(`Updated ${product.name} quantity`);
        } else {
          const newItem = {
            cartItemId: variationId,
            product: {
              _id: product._id,
              name: product.name,
              images: product.images,
              category: product.category,
              slug: product.slug,
            },
            priceOption,
            quantity,
            customizationNotes: customization,
            selectedFlavor: flavor,
            addedAt: new Date().toISOString(),
          };
          set({ cart: [...cart, newItem], cartOpen: true });
          toast.success(`Added ${product.name} to cart`);
        }
      },

      removeFromCart: (cartItemId) => {
        const filteredCart = get().cart.filter(
          (item) => item.cartItemId !== cartItemId,
        );
        set({ cart: filteredCart });
        toast.info("Item removed from cart");
      },

      updateCartItemQuantity: (cartItemId, newQuantity) => {
        if (newQuantity < 1) {
          get().removeFromCart(cartItemId);
          return;
        }

        const updatedCart = get().cart.map((item) =>
          item.cartItemId === cartItemId
            ? { ...item, quantity: newQuantity }
            : item,
        );
        set({ cart: updatedCart });
      },

      clearCart: () => {
        set({ cart: [] });
        toast.info("Cart cleared");
      },

      toggleCart: () => set((state) => ({ cartOpen: !state.cartOpen })),
      closeCart: () => set({ cartOpen: false }),

      getCartTotal: () => {
        return get().cart.reduce((total, item) => {
          return total + item.priceOption.price * item.quantity;
        }, 0);
      },

      getCartItemCount: () => {
        return get().cart.reduce((count, item) => count + item.quantity, 0);
      },

      // ========== WISHLIST STATE ==========
      wishlist: [],

      toggleWishlist: (product) => {
        const wishlist = get().wishlist;
        const isExistent = wishlist.some((item) => item._id === product._id);

        if (isExistent) {
          set({
            wishlist: wishlist.filter((item) => item._id !== product._id),
          });
          toast.info("Removed from wishlist");
        } else {
          set({ wishlist: [...wishlist, product] });
          toast.success("Added to wishlist");
        }
      },

      isInWishlist: (productId) => {
        return get().wishlist.some((item) => item._id === productId);
      },

      // ========== PRODUCTS STATE ==========
      products: [],
      isLoadingProducts: false,

      fetchProducts: async (params = {}) => {
        set({ isLoadingProducts: true });
        try {
          const query = new URLSearchParams({
            ...(params.category && { category: params.category }),
            available: "true",
          });
          const res = await fetch(`/api/products?${query}`);
          const data = await res.json();
          if (data.success) {
            set({ products: data.products });
          }
        } catch (error) {
          console.error("Fetch error:", error);
        } finally {
          set({ isLoadingProducts: false });
        }
      },

      // ========== UTILITIES ==========
      formatPrice: (price) => {
        return new Intl.NumberFormat("en-GH", {
          style: "currency",
          currency: "GHS",
        }).format(price);
      },
    }),
    {
      name: "bakery-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        cart: state.cart,
        wishlist: state.wishlist,
      }),
    },
  ),
);

// ========== SELECTOR HOOKS (Clean Exports) ==========

export const useCart = () => {
  const s = useStore();
  return {
    cart: s.cart,
    cartOpen: s.cartOpen,
    addToCart: s.addToCart,
    removeFromCart: s.removeFromCart,
    updateQuantity: s.updateCartItemQuantity,
    clearCart: s.clearCart,
    toggleCart: s.toggleCart,
    closeCart: s.closeCart,
    total: s.getCartTotal(),
    count: s.getCartItemCount(),
  };
};

export const useWishlist = () => {
  const s = useStore();
  return {
    wishlist: s.wishlist,
    toggleWishlist: s.toggleWishlist,
    isInWishlist: s.isInWishlist,
  };
};

export const useUI = () => {
  const s = useStore();
  return {
    formatPrice: s.formatPrice,
    isLoading: s.isLoadingProducts,
    fetchProducts: s.fetchProducts,
    products: s.products,
  };
};
