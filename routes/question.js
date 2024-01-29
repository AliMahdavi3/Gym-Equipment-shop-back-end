const express = require('express');
const questionController = require('../controllers/question');
const router = express.Router();


router.post('/question', questionController.createQuestion);
router.get('/questions', questionController.getQuestions);
router.get('/question/:questionId', questionController.getSingleQuestion);
router.put('/question/:questionId', questionController.editQuestion);
router.delete('/question/:questionId', questionController.deleteQuestion);


module.exports = router;