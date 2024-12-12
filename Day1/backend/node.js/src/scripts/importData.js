const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const Product = require('../models/product');

const importData = async () => {
  try {
    await mongoose.connect('mongodb://localhost/ecsite');

    const fileContent = fs.readFileSync(
      path.join(__dirname, '../data/product.json'), 
      'utf-8'
    );

    // 改行で区切られたJSONを配列に変換し、データを整形
    const products = fileContent
      .split('\n')
      .filter(line => line.trim() !== '')
      .map(line => {
        const product = JSON.parse(line);
        return {
          ...product,
          _id: product._id.$oid,
          created_at: new Date(product.created_at.$date),
          updated_at: new Date(product.updated_at.$date),
          seller_id: product.seller_id.$oid
        };
      });

    // 既存のデータを削除
    await Product.deleteMany();

    // 新しいデータを挿入
    const result = await Product.insertMany(products, { ordered: false });

    console.log(`${result.length}件のデータが正常にインポートされました！`);
    process.exit();
  } catch (error) {
    console.error('エラーが発生しました：', error);
    process.exit(1);
  }
};

importData();