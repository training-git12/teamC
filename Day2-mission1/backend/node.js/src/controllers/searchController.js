const Product = require('../models/product');

// 商品名での曖昧検索
exports.searchProducts = async (req, res) => {
    const { query } = req.query;  // クエリパラメータから検索ワードを取得
    
    if (!query || query.trim() === "") {
        return res.status(400).json({ message: 'Search query cannot be empty' });
    }

    try {
        // 商品名に対して曖昧検索を行う
        const products = await Product.find({
            name: { 
                $regex: query,  // 商品名に検索ワードを部分一致で検索
            }
        });

        // 該当する商品がない場合
        if (products.length === 0) {
            return res.status(404).json({ message: 'No products found matching the search criteria' });
        }

        // 該当する商品をJSON形式で返す
        res.json(products);
    } catch (error) {
        console.error("Error searching products:", error);
        res.status(500).send(error);
    }
};