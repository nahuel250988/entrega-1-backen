import fs from 'fs';
const path = './src/carts.json';

class CartManager {
    constructor() {
        this.carts = this.loadCarts();
    }

    
    loadCarts() {
        try {
            const data = fs.readFileSync(path, 'utf8');
            return JSON.parse(data);
        } catch (error) {
            return [];
        }
    }

    
    saveCarts() {
        fs.writeFileSync(path, JSON.stringify(this.carts, null, 2));
    }

    
    createCart() {
        const newCart = { id: Date.now().toString(), products: [] };
        this.carts.push(newCart);
        this.saveCarts();
        return newCart;
    }


    getCartById(id) {
        return this.carts.find(cart => cart.id === id);
    }


    addProductToCart(cartId, productId, quantity) {
        const cart = this.getCartById(cartId);
        if (cart) {
            const productIndex = cart.products.findIndex(product => product.product === productId);
            if (productIndex !== -1) {
                cart.products[productIndex].quantity += quantity;
            } else {
                cart.products.push({ product: productId, quantity });
            }
            this.saveCarts();
            return cart;
        }
        return null;
    }
}

export default CartManager;
