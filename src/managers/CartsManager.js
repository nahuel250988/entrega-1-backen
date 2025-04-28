import { promises as fs } from 'fs';

class CartManager {
constructor(path) {
    this.path = path;
    this.carts = [];
    this.loadCarts();
}

async loadCarts() {
    try {
    const data = await fs.readFile(this.path, 'utf8');
    this.carts = JSON.parse(data);
    } catch {
    this.carts = [];
    }
}

async saveCarts() {
    await fs.writeFile(this.path, JSON.stringify(this.carts, null, 2));
}

async createCart() {
    const newCart = { id: Date.now().toString(), products: [] };
    this.carts.push(newCart);
    await this.saveCarts();
    return newCart;
}

async getCartById(id) {
    return this.carts.find(cart => cart.id === id);
}

async addProductToCart(cartId, productId, quantity = 1) {
    const cart = await this.getCartById(cartId);
    if (!cart) return null;

    const index = cart.products.findIndex(p => p.product === productId);
    if (index !== -1) {
    cart.products[index].quantity += quantity;
    } else {
    cart.products.push({ product: productId, quantity });
    }

    await this.saveCarts();
    return cart;
}
}

export default CartManager;
