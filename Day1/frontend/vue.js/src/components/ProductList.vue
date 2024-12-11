<!-- components/ProductList.vue -->
<template>
  <div class="product-list">
    <h2>商品一覧</h2>
    <div class="products-grid">
      <div v-for="product in products" :key="product.id" class="product-card">
        <h3>{{ product.name }}</h3>
        <p>¥{{ product.price }}</p>
        <p>{{ product.description }}</p>
        <button @click="addToCart(product)">カートに追加</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ProductList',
  data() {
    return {
      products: [
        { id: 1, name: '商品1', price: 1000, description: '商品1の説明' },
        { id: 2, name: '商品2', price: 2000, description: '商品2の説明' },
        { id: 3, name: '商品3', price: 3000, description: '商品3の説明' }
      ]
    }
  },
  methods: {
    addToCart(product) {
      // カート追加のロジックを実装予定
      console.log(`${product.name}をカートに追加しました`)
    }
  }
}
</script>

<style scoped>
.product-list {
  padding: 20px;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
  padding: 20px;
}

.product-card {
  border: 1px solid #ddd;
  padding: 15px;
  border-radius: 8px;
}

button {
  background-color: #4CAF50;
  color: white;
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #45a049;
}
</style>