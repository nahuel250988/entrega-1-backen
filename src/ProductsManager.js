import fs from 'fs';
const path = 'products.json';

class ProductManager {
static async getProducts() {
    try {
    const data = await fs.promises.readFile(path, 'utf-8');
    return JSON.parse(data);
    } catch (error) {
    return [];
    }
}

static async getProductById(id) {
    const products = await this.getProducts();
    return products.find(product => product.id === id);
}

static async addProduct(product) {
    const products = await this.getProducts();
    const newProduct = { id: Date.now().toString(), ...product };
    products.push(newProduct);
    await fs.promises.writeFile(path, JSON.stringify(products, null, 2));
    return newProduct;
}

static async updateProduct(id, updatedProduct) {
    let products = await this.getProducts();
    const productIndex = products.findIndex(product => product.id === id);
    if (productIndex !== -1) {
    products[productIndex] = { ...products[productIndex], ...updatedProduct };
    await fs.promises.writeFile(path, JSON.stringify(products, null, 2));
    return products[productIndex];
    }
    return null;
}

static async deleteProduct(id) {
    let products = await this.getProducts();
    const productIndex = products.findIndex(product => product.id === id);
    if (productIndex !== -1) {
    products.splice(productIndex, 1);
    await fs.promises.writeFile(path, JSON.stringify(products, null, 2));
    return true;
    }
    return false;
}
}

export default ProductManager;
