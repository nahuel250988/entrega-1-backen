import express from 'express';
import ProductManager from './ProductsManager.js';
import CartManager from './CartsManager.js';

const app = express();
const port = 8080;

const productManager = new ProductManager('./src/products.json');
const cartManager = new CartManager('./src/carts.json');


app.use(express.json());


app.post('/products', async (req, res) => {
    const { title, description, code, price, status, stock, category, thumbnails } = req.body;

    if (!title || !description || !code || !price || !status || !stock || !category || !Array.isArray(thumbnails)) {
        return res.status(400).json({ error: 'Faltan campos requeridos' });
    }

    try {
        const newProduct = await productManager.addProduct({
            title,
            description,
            code,
            price,
            status,
            stock,
            category,
            thumbnails,
        });

        res.status(201).json(newProduct); 
    } catch (error) {
        res.status(500).json({ error: 'Error al crear el producto' });
    }
});


app.post('/cart', async (req, res) => {
    try {
        const newCart = await cartManager.createCart();
        res.status(201).json(newCart); 
    } catch (error) {
        res.status(500).json({ error: 'Error al crear el carrito' });
    }
});


app.post('/cart/:cartId/product/:productId', async (req, res) => {
    const { cartId, productId } = req.params;
    const { quantity } = req.body;

    if (!quantity || quantity <= 0) {
        return res.status(400).json({ error: 'Cantidad inválida' });
    }

    try {
        const product = await productManager.getProductById(productId);
        if (!product) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }

        const updatedCart = await cartManager.addProductToCart(cartId, productId, quantity);
        if (updatedCart) {
            res.status(200).json(updatedCart); 
        } else {
            res.status(404).json({ error: 'Carrito no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error al agregar el producto al carrito' });
    }
});


app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});
