const CART_KEY = 'f4a_cart';

// Lectura tolerante: un carrito corrupto no debe romper el catálogo.
const readCart = () => {
    try {
        const parsed = JSON.parse(localStorage.getItem(CART_KEY) || '[]');
        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
};

const writeCart = (cart) => {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
};

export const cartService = {
    getItems: readCart,

    addItem: (producto, cantidad = 1) => {
        const cart = readCart();
        const stock = Number.isFinite(producto.stock) ? producto.stock : Infinity;
        if (stock <= 0 || cantidad <= 0) return cart;

        const index = cart.findIndex((item) => item.id === producto.id);
        if (index >= 0) {
            const actual = Number(cart[index].cantidad) || 1;
            cart[index].cantidad = Math.min(stock, actual + cantidad);
        } else {
            cart.push({ ...producto, cantidad: Math.min(stock, cantidad) });
        }

        writeCart(cart);
        return cart;
    },

    clear: () => {
        localStorage.removeItem(CART_KEY);
    },
};
