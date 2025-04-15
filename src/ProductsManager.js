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
        } catch (error) {
            this.products = []; 
        }
    }

    
    async saveProducts() {
        try {
            await fs.writeFile(this.path, JSON.stringify(this.products, null, 2));
        } catch (error) {
            console.error("Error al guardar productos:", error);
        }
    }

    
    async addProduct({ title, description, code, price, status, stock, category, thumbnails }) {
        const newProduct = {
            id: Date.now().toString(), 
            title,
            description,
            code,
            price,
            status,
            stock,
            category,
            thumbnails
        };
        this.products.push(newProduct);
        await this.saveProducts();
        return newProduct;
    }

    
    async getProducts() {
        return this.products;
    }

    
    async getProductById(id) {
        return this.products.find(product => product.id === id);
    }

    
    async updateProduct(id, updatedProduct) {
        const product = this.products.find(product => product.id === id);
        if (product) {
            Object.assign(product, updatedProduct); 
            await this.saveProducts();
            return product;
        }
        return null; 
    }

    
    async deleteProduct(id) {
        const index = this.products.findIndex(product => product.id === id);
        if (index !== -1) {
            this.products.splice(index, 1); 
            await this.saveProducts();
            return true; 
        }
        return false; 
    }
}

export default ProductManager;
