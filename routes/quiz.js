const express = require('express');
const router = express.Router();
const Quiz = require('../models/quiz');

/* GET home page. */
router.get('/', (req, res) => {
  const show = !req.session.vote;

  Quiz.find({}, (err, data) => {
    // console.log(data);
    let sum = 0;
    data.forEach(item => {
      sum += item.vote;
    });
    res.render('quiz', { title: 'Quiz', data, show, sum }); //Zmieniamy tytuł na Quiz i nazwę templatki na quiz.
  });
  // new Quiz({ title: 'Pytanie 1', vote: 0 }).save();
  // res.render('quiz', { title: 'Quiz' }); //Zmieniamy tytuł na Quiz i nazwę templatki na quiz.
});

router.post('/', (req, res) => {
  const id = req.body.quiz;

  Quiz.findOne({ _id: id }, (err, data) => {
    // console.log(data);
    data.vote = data.vote + 1;
    data.save(err => {
      req.session.vote = 1;
      res.redirect('/quiz');
    });
    // res.redirect('/quiz');
  });
});

module.exports = router;
