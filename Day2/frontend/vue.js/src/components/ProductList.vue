//=============================================================================
// src/components/ProductList.vue
//
// 商品データを表示し、詳細情報や「いいね」機能などを提供するコンポーネントです
//=============================================================================

//-----------------------------------------------------------------------------
//テンプレートセレクション
// テンプレートセクションは、Vue コンポーネントの 見た目（UI）を定義します
// HTMLに似た記法を使用し、動的データをバインドしてUIをレンダリングします
//
// 動的データのバインディング:
//   {{}}（マスタッシュ記法）を使用して、スクリプトセクションで定義したデータや計算プロパティを表示できます
// ディレクティブ:
//   Vue.js 独自の属性（ディレクティブ）を利用して、HTML要素に動的な振る舞いを追加します
//   例: v-if、v-for、v-bind、v-on。
//-----------------------------------------------------------------------------
<template>
 <div class="product-list">
   <!-- ヘッダー部分に管理者モードのトグルを追加 -->
   <div class="header-controls">
     <h1>商品一覧</h1>
     <el-switch
       v-model="isAdminMode"
       class="admin-toggle"
       active-text="管理者モード"
       inactive-text="通常モード"
     />
   </div>

   <!-- 管理者モード時のコントロールパネル -->
   <div v-if="isAdminMode" class="admin-controls">
     <el-button type="danger" @click="clearAllLikes">
       全てのいいねを削除
     </el-button>
   </div>

   <!-- 商品グリッド -->
   <div class="product-grid">
     <el-card
       v-for="product in products" 
       :key="product._id"
       class="product-card"
       shadow="hover"  
     >
       <!-- 商品画像 -->
       <img :src="product.images[0]" alt="Product Image" class="product-image" />
       
       <div class="product-info">
         <h2>{{ product.name }}</h2>
         <p class="price">価格: {{ product.price }}円</p>
         <p class="description">{{ product.description }}</p>
         
         <!-- 管理者モード時のいいね管理ボタン -->
         <template v-if="isAdminMode && likedProducts[product._id]">
           <el-button
             type="danger"
             size="small"
             @click="removeLike(product)"
           >
             いいねを削除
           </el-button>
         </template>
         
         <!-- 通常モードのいいねボタン -->
         <template v-else>
           <el-button
             class="like-button"
             :class="{ 'is-liked': likedProducts[product._id] }"
             @click="likeProduct(product._id)"
             text
           >
             <el-icon :size="20">
               <svg v-if="likedProducts[product._id]" viewBox="0 0 24 24" fill="#ff4757" class="heart-icon">
                 <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
               </svg>
               <svg v-else viewBox="0 0 24 24" fill="#888" class="heart-icon">
                 <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
               </svg>
             </el-icon>
           </el-button>
         </template>
         
         <el-button type="primary" @click="showDetails(product)">詳細</el-button>
       </div>
     </el-card>
   </div>

   <!-- 商品詳細モーダル -->
   <el-dialog v-model="dialogVisible" title="商品詳細" width="50%">
     <div v-if="selectedProduct">
       <img :src="selectedProduct.images[0]" alt="Product Image" class="modal-image" />
       <p><strong>価格:</strong> {{ selectedProduct.price }}円</p>
       <p><strong>説明:</strong> {{ selectedProduct.description }}</p>
       <p><strong>ブランド:</strong> {{ selectedProduct.brand }}</p>
       <p>
         <strong>仕様:</strong> 素材 - {{ selectedProduct.specifications.material }},
         長さ - {{ selectedProduct.specifications.length }}
       </p>
     </div>
     <template #footer>
       <el-button @click="closeModal">閉じる</el-button>
     </template>
   </el-dialog>
 </div>
</template>

//-----------------------------------------------------------------------------
//スクリプトセレクション
// スクリプトセクションは、コンポーネントの ロジック や データ管理 を記述します
// 主に JavaScript を使い、Vue コンポーネントの機能を実装します
//
// オブジェクト形式で定義
// ・data    : コンポーネントの状態を保持
// ・methods : ユーザーアクションやカスタムロジックを実装
// ・computed: データの派生値（キャッシュされる）
// ・watch   : 特定のデータの変化を監視し、対応する処理を実行
// ・ライフサイクルフック: コンポーネントの初期化や破棄時に実行するコードを記述（例: mounted）
//-----------------------------------------------------------------------------
<script>
import { ElMessage, ElMessageBox } from 'element-plus'
//axios: HTTPリクエストライブラリで、APIを通じてバックエンドと通信します
import axios from "axios";


export default {
  //データプロパティ
  data() {
    return {
      products: [],
      selectedProduct: null,
      likedProducts: {},
      currentUserId: "671e0166eed5dc448afe6911",
      dialogVisible: false,
      isAdminMode: false,  // 管理者モードのフラグを追加
    };
  },
  
  //コンポーネントが初期化された際に呼び出されるライフサイクルフック
  async mounted() {
    await this.fetchProducts();      // 商品リストをAPIから取得
    await this.fetchLikedProducts(); // ユーザーが「いいね」した商品の状態を取得
  },
  
  methods: {
    //いいね済み商品の取得
    // ユーザーが「いいね」した商品IDを取得し、likedProducts オブジェクトに記録します
    async fetchLikedProducts() {
      try {
        this.likedProducts = {};
        const response = await axios.get(
          `http://54.248.228.85:3000/api/liked-products/${this.currentUserId}`
        );
        response.data.forEach((productId) => {
          this.likedProducts[productId] = true;
        });
      } catch (error) {
        console.error("Error fetching liked products:", error);
      }
    },
    
    //「いいね」状態を更新
    // 商品詳細モーダルで現在表示されている商品の「いいね」数を最新の状態に更新します
    updateSelectedProductLikeStatus() {
      if (this.selectedProduct) {
        this.selectedProduct.likes =
          this.products.find(
            (product) => product._id === this.selectedProduct._id
          )?.likes || 0;
      }
    },
    
    //商品リストの取得
    // API (/api/products) を呼び出して商品データを取得し、products 配列に保存します
    async fetchProducts() {
      try {
        const response = await axios.get(
          "http://54.248.228.85:3000/api/products"
        );
        console.log("取得した商品データ:", response.data); // デバッグ用
        this.products = response.data;
      } catch (error) {
        console.error("Error fetching products:", error); // エラーログ
      }
    },
    
    //商品詳細の表示
    // ユーザーが商品をクリックした際に、選択した商品データをselectedProductに設定し、
    // モーダルを表示します
    showDetails(product) {
      this.selectedProduct = product;  // 選択した商品を格納
      this.dialogVisible = true;       // モーダルを表示
    },
    
    //商品詳細モーダルを閉じる
    // モーダルを閉じる際に、selectedProductをリセットして非表示にします
    closeModal() {
      this.selectedProduct = null;  // 選択状態をリセット
      this.dialogVisible = false;   // モーダルを非表示
    },
    
    //商品を「いいね」する
    // ユーザーが「いいね」をクリックすると、APIにリクエストを送信し、「いいね」状態を更新します
    // 成功した場合、モーダル内の「いいね」数を更新し、ローカル状態にも反映します
    async likeProduct() {
      const productId = this.selectedProduct._id;

      if (this.likedProducts[productId]) {
        console.log("Product is already liked:", productId);
        return;
      }

      try {
        await axios.post("http://54.248.228.85:3000/api/like", {
          userId: this.currentUserId,
          productId,
        });

        const updatedProduct = await axios.get(
          `http://54.248.228.85:3000/api/products/${productId}`
        );
        // 更新された「いいね」数
        this.selectedProduct.likes = updatedProduct.data.likes;
        // 状態を更新
        this.likedProducts[productId] = true;
      } catch (error) {
        console.error("Error liking product:", error);
      }
    },

    // いいねを削除（個別）
    async removeLike(product) {
      try {
        const response = await axios.delete('http://54.248.228.85:3000/api/admin/likes', {
          data: { productId: product._id }
        });

        if (response.status === 200) {
          // ローカルの状態を更新
          this.likedProducts[product._id] = false;
          await this.fetchLikedProducts(); // いいね状態を再取得
          ElMessage.success('いいねを削除しました');
        }
      } catch (error) {
        console.error('Error removing like:', error);
        ElMessage.error('いいねの削除に失敗しました');
      }
    },

    // 全てのいいねを削除
    async clearAllLikes() {
      try {
        const confirmed = await ElMessageBox.confirm(
          'すべてのいいねを削除してもよろしいですか？',
          '確認',
          {
            confirmButtonText: '削除',
            cancelButtonText: 'キャンセル',
            type: 'warning'
          }
        );

        if (confirmed) {
          const response = await axios.delete('http://54.248.228.85:3000/api/admin/likes/all');

          if (response.status === 200) {
            await this.fetchLikedProducts(); // いいね状態を再取得
            ElMessage.success('すべてのいいねを削除しました');
          }
        }
      } catch (error) {
        if (error !== 'cancel') {
          console.error('Error clearing all likes:', error);
          ElMessage.error('いいねの一括削除に失敗しました');
        }
      }
    },
  },
};
</script>


//-----------------------------------------------------------------------------
//スタイルセレクション
// スタイルセクションは、コンポーネントのデザインやレイアウトを定義します。CSSやSCSSなどを記述します
//
// コンポーネントスコープ
// ・スタイルをそのコンポーネントに限定することができます（scoped 属性）
// プリプロセッサ
// ・SCSS、LESS、Stylus などの CSS 拡張言語を利用可能
//-----------------------------------------------------------------------------
<style>
/* 商品リスト全体のスタイル */
.product-list {
  max-width: 1200px;   /* コンテンツの最大幅を指定 */
  margin: auto;        /* コンテンツを中央寄せ */
  text-align: center;  /* テキストを中央揃え */
}

/* 商品カードのグリッドレイアウト */
.product-grid {
  display: grid;  /* グリッドレイアウトを使用 */
  gap: 20px;      /* 各カード間のスペース */
  /* カラムを自動調整 */
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr)); 
}

/* 商品カードのデザイン */
.product-card {
  padding: 20px;                    /* カード内の余白を設定 */
  border: 1px solid #eee;           /* カードの枠線の色を薄いグレーに設定 */
  display: flex;                    /* フレックスボックスを使用 */
  flex-direction: column;           /* 縦方向に配置 */
  justify-content: space-between;   /* 上下の要素を均等配置 */
  height: 100%;                     /* 高さを揃える */
}

/* 商品情報のレイアウト */
.product-info {
  display: flex;                    /* フレックスボックスを使用 */
  flex-direction: column;           /* 情報を縦方向に配置 */
  flex-grow: 1;                     /* スペースを確保 */
  justify-content: space-between;   /* 上下の要素間を均等に配置 */
}

/* 商品画像のスタイル */
.product-image {
  width: 100%;         /* 横幅をカード全体に合わせる */
  height: auto;        /* 縦横比を維持しながら画像をリサイズ */
  margin-bottom: 10px; /* 下に余白を追加 */
}

/* 価格のテキストデザイン */
.price {
  font-weight: bold;  /* テキストを太字に設定 */
  color: #555;        /* ダークグレーの色を使用 */
}

/* 商品説明テキスト */
.description {
  margin: 10px 0;   /* 上下に余白を追加 */
  flex-grow: 1;     /* ボタンを下部に配置するための余白確保 */
}

/* モーダル内の画像スタイル */
.modal-image {
  width: 50%;            /* 画面幅に応じたサイズ調整 */
  height: auto;          /* 縦横比を維持してリサイズ */
  margin-bottom: 20px;   /* 下に余白を追加 */
}

/* いいねアイコンのスタイル */
.like-section {
  display: flex;          /* アイコンとテキストを横並びに配置 */
  align-items: center;    /* 要素を垂直方向の中央に揃える */
  gap: 10px;              /* アイコンとテキストの間に余白を設定 */
}
</style>