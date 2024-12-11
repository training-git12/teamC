const Product = require('./models/product'); 

const getAllProducts = async () => {
    try {
        const products = await Product.find(); 
        return products;
    } catch (err) {
        console.error('Error fetching products:', err);
        throw err; 
    }
};

getAllProducts()
    .then((products) => {
        console.log('Products:', products);
    })
    .catch((err) => {
        console.error('Failed to get products:', err);
    });