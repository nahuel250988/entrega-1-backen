import express from 'express';
import ProductManager from './ProductManager.js';

const app = express();
const port = 3000;

const productManager = new ProductManager('./src/products.json');


app.use(express.json());


app.post('/', async (req, res) => {
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
            thumbnails
        });

        res.status(201).json(newProduct); 
    } catch (error) {
        res.status(500).json({ error: 'Error al crear el producto' });
    }
});


app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});
