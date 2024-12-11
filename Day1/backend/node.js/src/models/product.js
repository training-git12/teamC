const mongoose = require('../config/database'); 

const productSchema = new mongoose.Schema({
    id: { type: String, required: true},
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    type: { type: String, required: true },
    brand: { type: String, required: true },
    stock: { type: Number, required: true },
    images: { type: [String], required: true },
    rating: { type: Number, required: true},
    specifications: { type: Object, requre: true},
    discount: { type: Number, required: true},
    created_at: { type: Date, required: true},
    updated_at: { type: DataTransfer, required: true},
    tags: { type: [String], required: true},
    seller_id: { type: String, required: true},
    likes: { type: String, required: true},
    __v: { type: Number, required: true},
    reviews: { type: [String], required: true}
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;