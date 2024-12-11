const mongoose = require('../config/database'); 

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    type: { type: String, required: true },
    brand: { type: String, required: true },
    stock: { type: Number, required: true },
    images: { type: [String], required: true }
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;