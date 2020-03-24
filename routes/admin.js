const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', (req, res) => {
  res.render('admin', { title: 'Admin' }); //Zmieniamy tytuł na Admin i nazwę templatki na admin
});

module.exports = router;
