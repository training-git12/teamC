<template>
  <div class="mx-auto px-4 max-w-7xl">
    <h2 class="text-2xl font-bold my-6">商品一覧</h2>
    <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      <div v-for="product in products" :key="product._id.$oid" 
           class="bg-white rounded-lg border shadow-sm hover:shadow-md transition-shadow">
        <!-- 商品画像 -->
        <div class="aspect-square overflow-hidden">
          <img :src="product.images[0]" 
               :alt="product.name" 
               class="w-full h-full object-cover">
        </div>
        <!-- 商品情報 -->
        <div class="p-3">
          <h3 class="font-medium text-sm mb-1 line-clamp-2">{{ product.name }}</h3>
          <p class="text-xs text-gray-600 mb-2 line-clamp-2">{{ product.description }}</p>
          <div class="mt-auto">
            <p class="text-lg font-bold text-red-600">¥{{ product.price.toLocaleString() }}</p>
            <p class="text-xs text-gray-500">在庫: {{ product.stock }}個</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ProductList',
  data() {
    return {
      products: []
    }
  },
  async created() {
    try {
      const response = await fetch('http://localhost:3000/api/products')
      const data = await response.json()
      this.products = data
    } catch (error) {
      console.error('商品の取得に失敗しました:', error)
    }
  }
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>