const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', (req, res) => {
  res.render('news', { title: 'News' }); //usuwamy szablon index i tworzymy szablon news i przekazujemy tutaj tytuł News zamiast Express
});

module.exports = router;
