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
app.use(express.static(__dirname+ '/public/'));
const port = 8080;
app.set('view engine', 'pug');

function delete_article(artid) {
  const sql = 'DELETE from articles where id = '+artid+';';
  console.log(sql);
  const db = require('better-sqlite3')('database.sqlite', []);

  const articles = db.prepare(sql).run();
  return;

}
function insert_article(title, text) {
  const sql = `INSERT into articles('title', 'text') VALUES('`+ title+`', '`+text+`');`;
  console.log(sql);
  const db = require('better-sqlite3')('database.sqlite', []);

  const articles = db.prepare(sql).run();
  return;
}
function update_article(id, title, text) {
  const sql = `UPDATE articles set title='`+title+`', text='`+text+`' WHERE id = `+ id+`;`;
  console.log(sql);
  const db = require('better-sqlite3')('database.sqlite', []);

  const articles = db.prepare(sql).run();
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
    res.render('articles/index', { title: 'Articles', message: 'Show all articles', articles: articles })
  } catch (err) {
    console.log('get articles failed');
  }
});
app.get('/articles/:artId([0-9]+)', function (req, res) {
  console.log('show article'+req.params.artId);
  article = get_article(req.params.artId);
  res.render('articles/show', { artid: req.params.artId, title: 'Articles', message: 'Show article '+req.params.artId, article: article}, )
});
app.get('/articles/create', function (req, res) {
  console.log('create new article')
  res.render('articles/create', { artid: req.params.artId, title: 'Articles', message: 'Create new article' })
});
app.post('/articles', function (req, res) {
  if (req.body._method === 'delete') {
    console.log('delete article'+req.body.id)
    delete_article(req.body.id);
  } else if (req.body._method === 'put') {
    console.log('update article'+req.body.id)
    console.log(req.body);
    update_article(req.body.id, req.body.title, req.body.text)
  } else {
    console.log('store new article')
    console.log(req.body);
    insert_article(req.body.title, req.body.text);  
  }
  res.redirect('/articles/');
});
app.put('/articles/:artId', function (req, res) {
  console.log('put article #'+req.params.artId)
  update_article(req.params.artId, req.params.title, req.params.text); 
  res.redirect('articles/');
});
app.patch('/articles/:artId', function (req, res) {
  console.log('patch article #'+req.params.artId)
  update_article(req.params.artId, req.params.title, req.params.text); 
  res.redirect('articles/');
});
app.get('/articles/:artId/edit', function (req, res) {
  console.log('edit article')
  article = get_article(req.params.artId);
  res.render('articles/edit', { artid: req.params.artId, title: 'Articles', message: 'Edit article', article: article })
});
app.delete('/articles/:artId', function (req, res) {
  console.log('destroy article');
  console.log(req.params);
  console.log(req.params.artId);
  delete_article(req.params.artId);
  res.redirect('articles/');
});
app.get('/articles/:artId', function (req, res) {
  console.log('show article #'+req.params.artId)
  res.render('articles/edit', { artid: req.params.artId, title: 'Articles', message: 'Hello there, single article lover!' })
});
//app.get('/articles', function (req, res) {
//  res.render('articles/index', { title: 'Articles', message: 'Hello there, article lover!' })
//});
app.get('/', function (req, res) {
  res.render('index', { title: 'Article app', message: 'This is an app for maintaining a list of articles, to show a simple REST example' })
});

app.listen(port, function () {
  console.log('Example app listening on port 8080!')
});
