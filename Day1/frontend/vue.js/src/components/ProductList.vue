<template>
  <div class="mx-auto px-4 max-w-7xl">
    <h2 class="text-2xl font-bold my-6">商品一覧</h2>
    
    <!-- デバッグ情報の表示 -->
    <div class="mb-4 p-4 bg-gray-100">
      <p>データ取得状態: {{ loading ? '取得中...' : '完了' }}</p>
      <p>商品数: {{ products.length }}</p>
      <p v-if="error">エラー: {{ error }}</p>
    </div>

    <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      <div v-for="product in products" :key="product._id.$oid" 
           class="bg-white rounded-lg border shadow-sm hover:shadow-md transition-shadow">
        <!-- 商品情報（既存のコード） -->
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ProductList',
  data() {
    return {
      products: [],
      loading: true,
      error: null
    }
  },
  async created() {
    try {
      console.log('APIリクエスト開始');
      const response = await fetch('http://35.76.17.88:3000/api/products');
      console.log('APIレスポンス:', response);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('取得したデータ:', data);
      
      this.products = data;
    } catch (error) {
      console.error('エラー詳細:', error);
      this.error = error.message;
    } finally {
      this.loading = false;
    }
  }
}
</script>