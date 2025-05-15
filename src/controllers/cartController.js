import Cart from '../models/cart.js';
import Product from '../models/product.js';


export const createCart = async (req, res) => {
    const newCart = new Cart({ products: [] });
    await newCart.save();
    res.status(201).json(newCart);
};


export const getCartById = async (req, res) => {
    const cart = await Cart.findById(req.params.cid).populate('products.product');
    if (!cart) return res.status(404).json({ error: 'Carrito no encontrado' });
    res.json(cart);
};


export const addProductToCart = async (req, res) => {
    const { cid, pid } = req.params;
    const { quantity } = req.body;

    const cart = await Cart.findById(cid);
    const product = await Product.findById(pid);
    if (!cart || !product) return res.status(404).json({ error: 'Carrito o Producto no encontrado' });

    const existingProduct = cart.products.find(p => p.product.toString() === pid);
    if (existingProduct) {
        existingProduct.quantity += quantity;
    } else {
        cart.products.push({ product: pid, quantity });
    }

    await cart.save();
    res.status(200).json(cart);
};


export const removeProductFromCart = async (req, res) => {
    const { cid, pid } = req.params;
    const cart = await Cart.findById(cid);
    if (!cart) return res.status(404).json({ error: 'Carrito no encontrado' });

    const productIndex = cart.products.findIndex(p => p.product.toString() === pid);
    if (productIndex === -1) return res.status(404).json({ error: 'Producto no encontrado en el carrito' });

    cart.products.splice(productIndex, 1);
    await cart.save();
    res.json({ message: 'Producto eliminado del carrito' });
};
