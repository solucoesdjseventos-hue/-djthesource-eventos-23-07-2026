const express = require('express');
const { getServices, getServiceById, editService, addService } = require('../controllers/serviceController');

const router = express.Router();
router.get('/', getServices);
router.get('/:id', getServiceById);
router.post('/edit', editService);
router.post('/add', addService);

module.exports = router;
