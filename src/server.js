import express from 'express';
import { promises as fs } from 'fs';


class ProductManager {
constructor(path) {
    this.path = path;
    this.products = [];
    this.loadProducts();
}

async loadProducts() {
    try {
    const data = await fs.readFile(this.path, 'utf-8');
    this.products = JSON.parse(data);
    } catch (error) {
    this.products = [];
    }
}

async saveProducts() {
    await fs.writeFile(this.path, JSON.stringify(this.products, null, 2));
}

async addProduct({ title, description, code, price, status, stock, category, thumbnails }) {
    const exists = this.products.some(p => p.code === code);
    if (exists) throw new Error('El código ya existe');

    const newProduct = {
    id: Date.now().toString(),
    title,
    description,
    code,
    price,
    status,
    stock,
    category,
    thumbnails
    };

    this.products.push(newProduct);
    await this.saveProducts();
    return newProduct;
}

async getProducts() {
    return this.products;
}

async getProductById(id) {
    return this.products.find(product => product.id === id);
}

async updateProduct(id, updatedData) {
    const product = this.products.find(p => p.id === id);
    if (!product) return null;

    Object.assign(product, updatedData);
    await this.saveProducts();
    return product;
}

async deleteProduct(id) {
    const index = this.products.findIndex(product => product.id === id);
    if (index === -1) return false;

    this.products.splice(index, 1);
    await this.saveProducts();
    return true;
}
}

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
    } catch (error) {
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


const productManager = new ProductManager('./src/products.json');
const cartManager = new CartManager('./src/carts.json');


const app = express();
const port = 8080;

app.use(express.json());




app.get('/api/products', async (req, res) => {
const products = await productManager.getProducts();
res.json(products);
});


app.get('/api/products/:pid', async (req, res) => {
const product = await productManager.getProductById(req.params.pid);
if (!product) return res.status(404).json({ error: 'Producto no encontrado' });
res.json(product);
});


app.post('/api/products', async (req, res) => {
try {
    const newProduct = await productManager.addProduct(req.body);
    res.status(201).json(newProduct);
} catch (err) {
    res.status(400).json({ error: err.message });
}
});


app.put('/api/products/:pid', async (req, res) => {
const { pid } = req.params;
const { id, ...data } = req.body;

if (id) return res.status(400).json({ error: 'No se puede actualizar el ID' });

const updated = await productManager.updateProduct(pid, data);
if (!updated) return res.status(404).json({ error: 'Producto no encontrado' });

res.json(updated);
});


app.delete('/api/products/:pid', async (req, res) => {
const deleted = await productManager.deleteProduct(req.params.pid);
if (!deleted) return res.status(404).json({ error: 'Producto no encontrado' });

res.json({ message: 'Producto eliminado' });
});




app.post('/api/carts', async (req, res) => {
const newCart = await cartManager.createCart();
res.status(201).json(newCart);
});


app.get('/api/carts/:cid', async (req, res) => {
const cart = await cartManager.getCartById(req.params.cid);
if (!cart) return res.status(404).json({ error: 'Carrito no encontrado' });
res.json(cart.products);
});


app.post('/api/carts/:cid/product/:pid', async (req, res) => {
const { cid, pid } = req.params;

const product = await productManager.getProductById(pid);
if (!product) return res.status(404).json({ error: 'Producto no encontrado' });

const updatedCart = await cartManager.addProductToCart(cid, pid);
if (!updatedCart) return res.status(404).json({ error: 'Carrito no encontrado' });

res.status(200).json(updatedCart);
});


app.listen(port, () => {
console.log(`Servidor escuchando en http://localhost:${port}`);
});
