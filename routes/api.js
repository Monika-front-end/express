const express = require('express');
const router = express.Router();
const News = require('../models/news');
const defaultSort = -1;

/* GET home page. */
router.get('/', (req, res) => {
  // console.log(req.query);

  const search = req.query.search || '';
  let sort = req.query.sort || defaultSort;

  if (sort !== -1 || sort !== 1) {
    sort = defaultSort;
  }

  const findNews = News.find({ title: new RegExp(search.trim(), 'i') })
    .sort({
      created: sort
    })
    .select('_id title description');
  findNews.exec((err, data) => {
    // console.log(data);

    res.json(data); //usuwamy szablon index i tworzymy szablon news i przekazujemy tutaj tytuł News zamiast Express
  });
  // res.render('news', { title: 'News' }); //usuwamy szablon index i tworzymy szablon news i przekazujemy tutaj tytuł News zamiast Express
});

router.get('/:id', (req, res) => {
  // console.log(req.query);

  const id = req.params.id;

  const findNews = News.findById(id).select('_id title description');

  findNews.exec((err, data) => {
    // console.log(data);

    res.json(data); //usuwamy szablon index i tworzymy szablon news i przekazujemy tutaj tytuł News zamiast Express
  });
  // res.render('news', { title: 'News' }); //usuwamy szablon index i tworzymy szablon news i przekazujemy tutaj tytuł News zamiast Express
});

module.exports = router;
