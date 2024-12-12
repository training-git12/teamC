const Like = require('../models/like.js');

exports.deleteLike = async (req, res) => {
    const { productId } = req.body;
  
    try {
      // バリデーション: productIdが必須
      if (!productId) {
        return res.status(400).json({ error: 'productId is required.' });
      }
  
      // Likeデータの削除
      const result = await Like.findOneAndDelete({ productId });
  
      // データが見つからない場合
      if (!result) {
        return res.status(404).json({ error: 'Like not found for the given productId.' });
      }
  
      // 成功レスポンス
      res.status(200).json({ message: 'Like removed successfully for the given product.' });
    } catch (error) {
      console.error('Error deleting like:', error);
      res.status(500).json({ error: 'Internal server error.' });
    }
  };
  
  // すべての「いいね」を削除する関数
  exports.deleteAllLikes = async (req, res) => {
    try {
      // 全ての「いいね」を削除
      const result = await Like.deleteMany({});
  
      // 成功レスポンス
      res.status(200).json({ message: 'All likes removed successfully.' });
    } catch (error) {
      console.error('Error deleting all likes:', error);
      res.status(500).json({ error: 'Internal server error.' });
    }
  };