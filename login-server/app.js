const express = require('express');
const app = express();

app.all('*', function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.header('Access-Control-Allow-Methods', '*');
  res.header('Content-Type', 'application/json;charset=utf-8');
  next();
});

app.get('/login', (req, res) => {
  res.send(req.query);
});

app.listen(3000, () => {
  console.log('示例应用正在监听 3000 端口 !');
});
