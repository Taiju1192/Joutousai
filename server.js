const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 4000;

// publicディレクトリを静的ファイルとして提供
app.use(express.static(path.join(__dirname, 'public')));

// どのルートでも index.html を返す（SPA対応）
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

// サーバー起動
app.listen(PORT, () => {
  console.log(`🚀 サーバーが http://localhost:${PORT} で起動中`);
});
