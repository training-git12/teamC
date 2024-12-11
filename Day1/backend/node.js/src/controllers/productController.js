const Product = require('./models/product'); 

exports.getAllProducts = async (req, res) => {
    try {
        const products = await Product.find({});
        res.json(products);
    } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).send(error);
    }
};

exports.getProductById = async (req, res) => {
    const { productId } = req.params;
    
    try {
        const product = await Product.findById(productId);
        if (!product) return res.status(404).json({ message: 'Product not found' });
        res.json(product);
    } catch (error) {
        console.error("Error fetching product:", error);
        res.status(500).send(error);
    }
};