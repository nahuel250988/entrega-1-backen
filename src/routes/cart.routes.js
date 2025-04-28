import { Router } from 'express';

export default function cartRoutes(cartManager, productManager) {
const router = Router();

router.post('/', async (req, res) => {
    const newCart = await cartManager.createCart();
    res.status(201).json(newCart);
});

router.get('/:cid', async (req, res) => {
    const cart = await cartManager.getCartById(req.params.cid);
    if (!cart) return res.status(404).json({ error: 'Carrito no encontrado' });
    res.json(cart.products);
});

router.post('/:cid/product/:pid', async (req, res) => {
    const { cid, pid } = req.params;
    const product = await productManager.getProductById(pid);
    if (!product) return res.status(404).json({ error: 'Producto no encontrado' });

    const updatedCart = await cartManager.addProductToCart(cid, pid, 1);
    if (!updatedCart) return res.status(404).json({ error: 'Carrito no encontrado' });

    res.status(200).json(updatedCart);
});

return router;
}
