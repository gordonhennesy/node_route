const express = require('express');
const app = express();
const router = express.Router();
const mongoose = require('mongoose');
//const sqlite3 = require('sqlite3').verbose();
//const sqlite3 = require('better-sqlite3')('database.sqlite', []);;
const db = require('better-sqlite3')('database.sqlite', []);
bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));
const path = __dirname + '/views/';
const port = 8080;
app.set('view engine', 'pug');

function insert_article(title, text) {
  const sql = `INSERT into articles('title', 'text') VALUES('`+ title+`', '`+text+`');`;
  console.log(sql);
  //const db = require('better-sqlite3')('database.sqlite', []);

  const articles = db.prepare(sql).run();
//  console.log(articles);
  return;
}
function update_article(id, title, text) {
  //const db = require('better-sqlite3')('database.sqlite', []);
  const sql = "UPDATE articles set title=?, text = ? WHERE id = ?";
  console.log(sql);

  db.prepare(sql).run(title, text, id);
  return;
}
function get_article(artId) {
  const article = db.prepare('SELECT * FROM articles WHERE id = ?').get(artId);
  console.log(article);
  return article;
}
function delete_article(artId) {
  db.prepare('DELETE FROM articles WHERE id = ?').run(artId);
  return;
}
function get_articles() {
  const articles = db.prepare('SELECT * FROM articles').all();
  return articles;
}

// ROUTES
app.get('/articles', function (req, res) {
  console.log('index articles');
  try {
    var articles = get_articles();
    res.render('articles/index', { artid: req.params.artId, title: 'Articles', message: 'Show all articles', articles: articles })
  } catch (err) {
    console.log('get articles failed');
  }
});
app.get('/articles/:artId([0-9]+)', function (req, res) {
  console.log('show article')
  article = get_article(req.params.artId);
  res.render('articles/show', { artid: req.params.artId, title: 'Articles', message: 'Show article '+req.params.artId, article: article}, )
});
app.get('/articles/create', function (req, res) {
  console.log('create new article')
  res.render('articles/create', { artid: req.params.artId, title: 'Articles', message: 'Create new article' })
});
app.post('/articles', function (req, res) {
  console.log('store new article')
  console.log(req.body);
  insert_article(req.body.title, req.body.text);  
  res.redirect(301,'/articles');
});
function handle_patch_put(artId, title, text){
  console.log(title);
  article = update_article(artId, title, text);
}
app.post('/articles/:artId', function (req, res) {
  handle_patch_put(req.params.artId, req.body.title, req.body.text);
  res.redirect(301,'/articles');
});
app.put('/articles/:artId', function (req, res) {
  console.log('put article #'+req.params.artId);
  handle_patch_put(req.params.artId, req.body.title, req.body.text);
  res.redirect(301,'/articles');
});
app.patch('/articles/:artId', function (req, res) {
  console.log('patch article #'+req.params.artId);
  handle_patch_put(req.params.artId, req.body.title, req.body.text);
  res.redirect(301,'/articles');
});
app.get('/articles/:artId/edit', function (req, res) {
  console.log('edit article')
  article = get_article(req.params.artId);
  res.render('articles/edit', { artid: req.params.artId, title: 'Articles', message: 'Edit article' })
});
app.delete('/articles/:artId', function (req, res) {
  console.log('destroy article'+req.params.artId);
  delete_article(req.params.artId);
  res.redirect(301,'/articles');
});
app.get('/', function (req, res) {
  res.render('index', { title: 'Hey', message: 'Hello there!' })
});

app.listen(port, function () {
  console.log('Example app listening on port 8080!')
});