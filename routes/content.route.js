const express = require('express');
const router = express.Router();
const SchemaValidator = require('../middlewares/SchemaValidator');
const validateRequest = SchemaValidator(true);

const contentController = require('../controllers/content.controller');

router.get('/cards/:skip/:search_query', contentController.getCards);
router.get('/card/:id', contentController.getOneCard);
router.post('/comment', contentController.comment);
router.post('/delete_file', contentController.deleteContent);

module.exports = router;
