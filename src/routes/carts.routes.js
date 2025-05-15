import { Router } from 'express';
import { createCart, getCartById, addProductToCart, removeProductFromCart } from '../controllers/cartController.js';

const router = Router();

router.post('/', createCart);
router.get('/:cid', getCartById);
router.post('/:cid/products/:pid', addProductToCart);
router.delete('/:cid/products/:pid', removeProductFromCart);

export default router;
