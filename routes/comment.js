const express = require('express');
const commentController = require('../controllers/comment');
const router = express.Router();


router.post('/comment', commentController.createComment);
router.get('/comments', commentController.getComments);
router.delete('/comment/:commentId', commentController.deleteComment);


module.exports = router;