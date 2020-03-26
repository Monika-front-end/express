const express = require('express');
const News = require('../models/news');
const router = express.Router();

router.all('*', (req, res, next) => {
  if (!req.session.admin) {
    res.redirect('login');
    return;
  }

  next();
});

/* GET home page. */
// router.get('/', (req, res) => {
// const newsData = new News({
//   title: 'Tytuł testowy',
//   description: 'Opis'
// });

// newsData.save(err => {
//   console.log(err);
// });

// console.log(req.session.admin);
router.get('/', (req, res) => {
  News.find({}, (err, data) => {
    // console.log(data);
    res.render('admin/index', { title: 'Admin', data });
  });
});
//   res.render('admin/index', { title: 'Admin' }); //Zmieniamy tytuł na Admin i nazwę templatki na admin
// });

router.get('/news/add', (req, res) => {
  res.render('admin/news-form', { title: 'Dodaj news', body: {}, errors: {} });
});

router.post('/news/add', (req, res) => {
  const body = req.body;

  const newsData = new News(body);

  const errors = newsData.validateSync();

  newsData.save(err => {
    // console.log(err);
    if (err) {
      res.render('admin/news-form', { title: 'Dodaj news', errors, body });
      return;
    }
    res.redirect('/admin');
  });

  // res.render('admin/news-form', { title: 'Dodaj news', errors, body });
});

router.get('/news/delete/:id', (req, res) => {
  News.findByIdAndDelete(req.params.id, err => {
    res.redirect('/admin');
  });
});

module.exports = router;
