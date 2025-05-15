import express from 'express';
import mongoose from 'mongoose';
import connectMongoDB from './config/db.js';
import productRoutes from './routes/product.routes.js';
import cartRoutes from './routes/cart.routes.js';

const app = express();
const port = 8080;

app.use(express.json());
app.use('/api/products', productRoutes);
app.use('/api/carts', cartRoutes);

connectMongoDB();

app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});
