import { promises as fs } from 'fs';

class CartManager {
    constructor(path) {
        this.path = path;
        this.carts = [];
        this.loadCarts();
    }

    async loadCarts() {
        try {
            const data = await fs.readFile(this.path, 'utf-8');
            this.carts = JSON.parse(data);
            console.log('Carritos cargados desde el archivo:', this.carts);
        } catch (error) {
            console.error('Error al cargar carritos:', error);
            this.carts = [];
        }
    }

    async saveCarts() {
        try {
            await fs.writeFile(this.path, JSON.stringify(this.carts, null, 2));
            console.log('Carritos guardados en el archivo');
        } catch (error) {
            console.error('Error al guardar carritos:', error);
        }
    }

    async createCart() {
        const newCart = { id: Date.now().toString(), products: [] };
        this.carts.push(newCart);
        await this.saveCarts();
        console.log('Carrito creado:', newCart);
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
                console.log(`Producto ${productId} actualizado en el carrito ${cartId}`);
            } else {
                cart.products.push({ product: productId, quantity });
                console.log(`Producto ${productId} agregado al carrito ${cartId}`);
            }
            await this.saveCarts();
            return cart;
        }
        return null;
    }
}

export default CartManager;
