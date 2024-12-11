<template>
  <div class="container mx-auto px-4">
    <h1 class="text-2xl font-bold my-8">商品一覧</h1>
    <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
      <div v-for="product in products" :key="product._id.$oid" 
           class="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300">
        <!-- 画像サイズを調整 -->
        <div class="w-full aspect-square overflow-hidden">
          <img :src="product.images[0]" 
               :alt="product.name" 
               class="w-full h-full object-cover hover:scale-105 transition-transform duration-300">
        </div>
        <!-- 商品情報 -->
        <div class="p-4">
          <h2 class="text-lg font-medium mb-2 h-14 line-clamp-2">{{ product.name }}</h2>
          <p class="text-gray-600 text-sm mb-3 h-12 line-clamp-2">{{ product.description }}</p>
          <div class="flex justify-between items-end">
            <div>
              <p class="text-xl font-bold text-red-600">¥{{ product.price.toLocaleString() }}</p>
              <p class="text-sm text-gray-500">在庫: {{ product.stock }}個</p>
            </div>
            <button class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 text-sm">
              カートに入れる
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      products: [],
      loading: true
    }
  },
  async created() {
    try {
      const response = await fetch('http://localhost:3000/api/products')
      const data = await response.json()
      this.products = data
    } catch (error) {
      console.error('商品の取得に失敗しました:', error)
    } finally {
      this.loading = false
    }
  }
}
</script>

<style>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>