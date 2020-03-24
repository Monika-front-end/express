const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', (req, res) => {
  res.render('quiz', { title: 'Quiz' }); //Zmieniamy tytuł na Quiz i nazwę templatki na quiz.
});

module.exports = router;
