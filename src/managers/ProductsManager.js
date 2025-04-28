import { promises as fs } from 'fs';

class ProductManager {
constructor(path) {
    this.path = path;
    this.products = [];
    this.loadProducts();
}

async loadProducts() {
    try {
    const data = await fs.readFile(this.path, 'utf-8');
    this.products = JSON.parse(data);
    } catch {
    this.products = [];
    }
}

async saveProducts() {
    await fs.writeFile(this.path, JSON.stringify(this.products, null, 2));
}

async getProducts() {
    return this.products;
}

async getProductById(id) {
    return this.products.find(p => p.id === id);
}

async addProduct(product) {
    if (this.products.some(p => p.code === product.code)) {
    throw new Error('El código ya existe');
    }
    const newProduct = { ...product, id: Date.now().toString() };
    this.products.push(newProduct);
    await this.saveProducts();
    return newProduct;
}

async deleteProduct(id) {
    const index = this.products.findIndex(p => p.id === id);
    if (index === -1) return false;
    this.products.splice(index, 1);
    await this.saveProducts();
    return true;
}
}

export default ProductManager;
