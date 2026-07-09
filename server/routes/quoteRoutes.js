const express = require('express');
const { sendQuote, listQuotes, deleteQuoteHandler } = require('../controllers/quoteController');

const router = express.Router();
router.post('/quote', sendQuote);
router.get('/quotes', listQuotes);
router.delete('/quotes/:id', deleteQuoteHandler);

module.exports = router;
