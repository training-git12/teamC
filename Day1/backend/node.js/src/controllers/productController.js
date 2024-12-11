//=============================================================================
// controllers/productController.js
//
// 役割：商品データを操作するためのコントローラーであり、以下の3つの主要な機能を提供します
// - 全商品の取得
// - 特定の商品をIDで取得
// - 検索クエリに基づいた商品検索
//
// 目的
// - 商品の表示・検索:
//   商品一覧や特定の商品、検索条件に一致する商品の情報をクライアントへ提供し、
//   ECサイトの主要機能である「商品表示」と「検索」をサポートします
// - データの整合性を確保:
//   データベースとクライアント間で正確な商品データをやり取りするため、適切なエラーハンドリングを実施します
// - エンドポイントの再利用性:
//   コントローラーとしてエンドポイントに対応した処理を切り出し、コードの再利用性と保守性を向上させます
//=============================================================================

const getAllProducts = async () => {
    try {
        const products = await Product.find();
        return products;
    } catch (err) {
        console.error('Error fetching products:', err);
        throw new Error('Unable to fetch products from database'); 
    }
};

app.get('/api/products', async (req, res) => {
    try {
        const products = await getAllProducts();
        if (!products) {
            return res.status(404).json({ message: 'No products found' }); 
        }
        res.json(products); 
    } catch (err) {
        console.error('Error in API endpoint:', err);
        res.status(500).json({ message: 'Error fetching products', error: err.message }); 
    }
});