const fs = require('fs');
const path = require('path');

// 元のデータを読み込む
const rawData = fs.readFileSync(path.join(__dirname, 'product.json'), 'utf8');

// 各行をJSONオブジェクトに変換
const products = rawData
    .split('\n')
    .filter(line => line.trim() !== '')
    .map(line => JSON.parse(line));

// 新しい形式のJSONを作成
const formattedJson = {
    products: products
};

// 元のファイルをバックアップ
fs.renameSync(
    path.join(__dirname, 'product.json'),
    path.join(__dirname, 'product.json.bak')
);

// 新しいファイルに書き出し
fs.writeFileSync(
    path.join(__dirname, 'product.json'),
    JSON.stringify(formattedJson, null, 2)
);

console.log('Conversion completed successfully');