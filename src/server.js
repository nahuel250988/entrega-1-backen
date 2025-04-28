import express from 'express';
import { create } from 'express-handlebars';
import { Server } from 'socket.io';
import http from 'http';
import path from 'path';
import { fileURLToPath } from 'url';

import ProductManager from './managers/ProductManager.js';
import CartManager from './managers/CartManager.js';

import productRoutes from './routes/product.routes.js';
import cartRoutes from './routes/cart.routes.js';
import viewRoutes from './routes/view.routes.js';
import socketHandler from './sockets.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const productManager = new ProductManager(path.join(__dirname, 'data/products.json'));
const cartManager = new CartManager(path.join(__dirname, 'data/carts.json'));

app.engine('.handlebars', create({ extname: '.handlebars' }).engine);
app.set('view engine', '.handlebars');
app.set('views', path.join(__dirname, 'views'));

app.use(express.json());

app.use('/', viewRoutes(productManager));
app.use('/api/products', productRoutes(io, productManager));
app.use('/api/carts', cartRoutes(cartManager, productManager));

socketHandler(io, productManager);

const port = 8080;
server.listen(port, () => {
console.log(`Servidor corriendo en http://localhost:${port}`);
});
