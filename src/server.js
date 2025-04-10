import express from 'express';
import ProductManager from './ProductsManager.js';
import CartManager from './CartsManager.js';

const app = express();
const PORT = 8080;


const productManager = new ProductManager();
const cartManager = new CartManager();


app.use(express.json());


app.get('/api/products', (req, res) => {
    res.json(productManager.getAllProducts());
});

app.get('/api/products/:pid', (req, res) => {
    const product = productManager.getProductById(req.params.pid);
    if (product) {
        res.json(product);
    } else {
        res.status(404).json({ message: 'Producto no encontrado' });
    }
});

app.post('/api/products', (req, res) => {
    const newProduct = productManager.addProduct(req.body);
    res.status(201).json(newProduct);
});

app.put('/api/products/:pid', (req, res) => {
    const updatedProduct = productManager.updateProduct(req.params.pid, req.body);
    if (updatedProduct) {
        res.json(updatedProduct);
    } else {
        res.status(404).json({ message: 'Producto no encontrado' });
    }
});

app.delete('/api/products/:pid', (req, res) => {
    const deletedProduct = productManager.deleteProduct(req.params.pid);
    if (deletedProduct) {
        res.json(deletedProduct);
    } else {
        res.status(404).json({ message: 'Producto no encontrado' });
    }
});


app.post('/api/carts', (req, res) => {
    const newCart = cartManager.createCart();
    res.status(201).json(newCart);
});

app.get('/api/carts/:cid', (req, res) => {
    const cart = cartManager.getCartById(req.params.cid);
    if (cart) {
        res.json(cart.products);
    } else {
        res.status(404).json({ message: 'Carrito no encontrado' });
    }
});

app.post('/api/carts/:cid/product/:pid', (req, res) => {
    const { quantity } = req.body;
    const updatedCart = cartManager.addProductToCart(req.params.cid, req.params.pid, quantity);
    if (updatedCart) {
        res.json(updatedCart);
    } else {
        res.status(404).json({ message: 'Carrito no encontrado o producto no agregado' });
    }
});


app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
