import express from 'express';
import { create } from 'express-handlebars';
import path from 'path';

const app = express();

app.engine('.handlebars', create({ extname: '.handlebars' }).engine);
app.set('view engine', '.handlebars');
app.set('views', path.join(__dirname, 'views'));

export default app;
