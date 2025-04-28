import { Router } from 'express';

export default function productRoutes(io, productManager) {
const router = Router();

router.get('/', async (req, res) => {
    const products = await productManager.getProducts();
    res.json(products);
});

router.get('/:pid', async (req, res) => {
    const product = await productManager.getProductById(req.params.pid);
    if (!product) return res.status(404).json({ error: 'Producto no encontrado' });
    res.json(product);
});

router.post('/', async (req, res) => {
    try {
    const newProduct = await productManager.addProduct(req.body);
    io.emit('updateProducts', await productManager.getProducts());
    res.status(201).json(newProduct);
    } catch (err) {
    res.status(400).json({ error: err.message });
    }
});

router.delete('/:pid', async (req, res) => {
    const deleted = await productManager.deleteProduct(req.params.pid);
    if (!deleted) return res.status(404).json({ error: 'Producto no encontrado' });

    io.emit('updateProducts', await productManager.getProducts());
    res.json({ message: 'Producto eliminado' });
});

return router;
}
