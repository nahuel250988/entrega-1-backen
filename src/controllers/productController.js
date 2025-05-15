import Product from '../models/product.js';


export const createProduct = async (req, res) => {
    try {
        const { title, description, thumbnail, code, price, stock, category, status, tags } = req.body;

        const existingProduct = await Product.findOne({ code });
        if (existingProduct) {
            return res.status(400).json({ error: 'El código ya existe' });
        }

        const newProduct = new Product({
            title,
            description,
            thumbnail,
            code,
            price,
            stock,
            category,
            status: status !== undefined ? status : true,
            tags: tags || []
        });

        await newProduct.save();
        res.status(201).json(newProduct);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};


export const getProducts = async (req, res) => {
    try {
        const { limit = 10, page = 1, sort = 'asc', query = {} } = req.query;

        const products = await Product.find(query)
            .limit(Number(limit))
            .skip(Number(limit) * (page - 1))
            .sort({ price: sort === 'asc' ? 1 : -1 });

        const total = await Product.countDocuments(query);
        const totalPages = Math.ceil(total / limit);
        const prevPage = page > 1 ? page - 1 : null;
        const nextPage = page < totalPages ? page + 1 : null;

        res.json({
            status: 'success',
            payload: products,
            totalPages,
            prevPage,
            nextPage,
            page,
            hasPrevPage: page > 1,
            hasNextPage: page < totalPages,
            prevLink: prevPage ? `/api/products?page=${prevPage}&limit=${limit}` : null,
            nextLink: nextPage ? `/api/products?page=${nextPage}&limit=${limit}` : null
        });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};
