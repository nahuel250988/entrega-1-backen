import { promises as fs } from 'fs';
const path = './src/carts.json';

class CartManager {
    constructor() {
        this.carts = [];
        this.init();
    }

    async init() {
        await this.loadCarts();
    }

    async loadCarts() {
        try {
            const data = await fs.readFile(path, 'utf8');
            this.carts = JSON.parse(data);
        } catch (error) {
            this.carts = [];
        }
    }

    async saveCarts() {
        try {
            await fs.writeFile(path, JSON.stringify(this.carts, null, 2));
        } catch (error) {
            console.error("Error al guardar los carritos:", error);
        }
    }

    async createCart() {
        const newCart = {
            id: Date.now().toString(),
            products: []
        };
        this.carts.push(newCart);
        await this.saveCarts();
        return newCart;
    }

    async getCartById(id) {
        return this.carts.find(cart => cart.id === id);
    }

    async addProductToCart(cartId, productId, quantity) {
        const cart = await this.getCartById(cartId);
        if (cart) {
            const productIndex = cart.products.findIndex(p => p.product === productId);
            if (productIndex !== -1) {
                cart.products[productIndex].quantity += quantity;
            } else {
                cart.products.push({ product: productId, quantity });
            }
            await this.saveCarts();
            return cart;
        }
        return null;
    }
}

export default CartManager;
