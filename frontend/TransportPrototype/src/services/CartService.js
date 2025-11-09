import AsyncStorage from '@react-native-async-storage/async-storage';

const CART_STORAGE_KEY = 'shopping_cart';

export const cartService = {
  // Obtener el carrito actual
  async getCart() {
    try {
      const cartJson = await AsyncStorage.getItem(CART_STORAGE_KEY);
      return cartJson ? JSON.parse(cartJson) : {};
    } catch (error) {
      console.error('Error getting cart:', error);
      return {};
    }
  },

  // Guardar el carrito completo
  async saveCart(cart) {
    try {
      await AsyncStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
      return { success: true };
    } catch (error) {
      console.error('Error saving cart:', error);
      return { success: false, error };
    }
  },

  // Actualizar cantidad de un producto específico
  async updateProductAmount(productId, amount) {
    try {
      const cart = await this.getCart();
      
      if (amount <= 0) {
        // Si la cantidad es 0 o negativa, eliminar del carrito
        delete cart[productId];
      } else {
        cart[productId] = amount;
      }
      
      await this.saveCart(cart);
      return { success: true };
    } catch (error) {
      console.error('Error updating product amount:', error);
      return { success: false, error };
    }
  },

  // Obtener cantidad de un producto específico
  async getProductAmount(productId) {
    try {
      const cart = await this.getCart();
      return cart[productId] || 0;
    } catch (error) {
      console.error('Error getting product amount:', error);
      return 0;
    }
  },

  // Limpiar el carrito
  async clearCart() {
    try {
      await AsyncStorage.removeItem(CART_STORAGE_KEY);
      return { success: true };
    } catch (error) {
      console.error('Error clearing cart:', error);
      return { success: false, error };
    }
  },

  // Calcular total del carrito
  calculateTotal(products) {
    return products.reduce((total, product) => {
      return total + (product.precio * product.amount);
    }, 0);
  }
};