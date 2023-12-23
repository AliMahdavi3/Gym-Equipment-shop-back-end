const express = require('express');
const articleController = require('../controllers/article');
const router = express.Router();



router.post('/article', articleController.createArticle);
router.get('/articles', articleController.getArticles);
router.get('/article/:articleId', articleController.getSingleArticle);



module.exports = router;