import express from 'express';
import { create } from 'express-handlebars';
import { Server } from 'socket.io';
import http from 'http';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';


import productRoutes from './routes/product.routes.js';
import cartRoutes from './routes/cart.routes.js';
import viewRoutes from './routes/view.routes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.engine('.handlebars', create({ extname: '.handlebars' }).engine);
app.set('view engine', '.handlebars');
app.set('views', path.join(__dirname, 'views'));


app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));


app.use('/', viewRoutes());
app.use('/api/products', productRoutes(io));
app.use('/api/carts', cartRoutes());


const MONGO_URI = 'mongodb://localhost:27017/ecommerce';
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('Conectado a MongoDB'))
  .catch(err => console.error('Error al conectar a MongoDB:', err));


const port = 8080;
server.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
