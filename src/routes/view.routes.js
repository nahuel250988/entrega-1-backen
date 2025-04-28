import { Router } from 'express';

export default function viewRoutes(productManager) {
const router = Router();

router.get('/', async (req, res) => {
    const products = await productManager.getProducts();
    res.render('home', { title: 'Home', products });
});

router.get('/realtimeproducts', async (req, res) => {
    const products = await productManager.getProducts();
    res.render('realTimeProducts', { title: 'Productos en Tiempo Real', products });
});

return router;
}
