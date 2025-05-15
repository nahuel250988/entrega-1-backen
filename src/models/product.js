import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
title: { type: String, unique: true },
description: { type: String, index:"text" },
thumbnail: {type: String, require: false},
code: String,
price: Number,
stock: Number,
category: { type: String, index: true },
status: Boolean,
tags: Array,
createdAt:{ type: Date, default: Date.now}
});

const Product = mongoose.model('Product', productSchema);

export default Product;
