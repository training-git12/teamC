<template>
  <div id="app">
    <nav>
      <h1>ECサイト</h1>
    </nav>
    <ProductList />
  </div>
</template>

<script>
import ProductList from './components/ProductList.vue'

export default {
  name: 'App',
  components: {
    ProductList
  }
}

</script>

<style>
#app {
  font-family: Arial, sans-serif;
}

nav {
  background-color: #333;
  color: white;
  padding: 1rem;
}
</style>