const express = require('express');
const app = express();
const router = express.Router();
const mongoose = require('mongoose');
//const sqlite3 = require('sqlite3').verbose();
const sqlite3 = require('better-sqlite3')('database.sqlite', []);;
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
  const db = require('better-sqlite3')('database.sqlite', []);

  const articles = db.prepare(sql).run();
//  console.log(articles);
  return;
}
function get_article(artId) {
  const sql = `SELECT title, text FROM articles
           WHERE id = artId`;
  const db = require('better-sqlite3')('database.sqlite', []);

  const article = db.prepare('SELECT * FROM articles WHERE id = ?').get(artId);
  console.log(article);
  return article;
}
function get_articles() {
  const sql = `SELECT DISTINCT title title, text FROM articles
           ORDER BY title`;
  const db = require('better-sqlite3')('database.sqlite', []);

  const articles = db.prepare('SELECT * FROM articles').all();
  return articles;
}
app.get('/articles', function (req, res) {
  console.log('index articles');
  try {
    var articles = get_articles();
    //console.log(articles);
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
  //console.log(req);
console.log(req.params);
console.log(req.query);
console.log(req.body);
  insert_article(req.body.title, req.body.text);  
  res.render('articles/store', { params: req.params, title: 'Articles', message: 'Hello there, single article lover!' })
});
app.get('/articles/:artId/edit', function (req, res) {
  console.log('edit article')
  res.render('articles/edit', { artid: req.params.artId, title: 'Articles', message: 'Edit article' })
});
app.patch('/articles/:artId', function (req, res) {
  console.log('patch article #'+req.params.artId)
  res.render('articles/edit', { artid: req.params.artId, title: 'Articles', message: 'Updating article #'+req.params.artId })
});
app.delete('/articles/:artId', function (req, res) {
  console.log('destroy article')
  res.render('articles/delete', { artid: req.params.artId, title: 'Articles', message: 'Hello there, single article lover!' })
});
app.get('/articles/:artId', function (req, res) {
  console.log('show article #'+req.params.artId)
  res.render('articles/index', { artid: req.params.artId, title: 'Articles', message: 'Hello there, single article lover!' })
});
//app.get('/articles', function (req, res) {
//  res.render('articles/index', { title: 'Articles', message: 'Hello there, article lover!' })
//});
app.get('/', function (req, res) {
  res.render('index', { title: 'Hey', message: 'Hello there!' })
});

app.listen(port, function () {
  console.log('Example app listening on port 8080!')
});


/*router.use(function (req,res,next) {
  console.log('/' + req.method);
  next();
});
//router.get('/', function(req,res){
//  res.sendFile(path + 'index.html');
//});

router.get('/sharks', function(req,res){
  res.sendFile(path + 'sharks.html');
});
*/
/*
app.use(express.static(path));
app.use('/', router);
*/
//module.exports = Article;
/**
db.close((err) => {
  if (err) {
    return console.error(err.message);
  }
  console.log('Close the database connection.');
});
**/
