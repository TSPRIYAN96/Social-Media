const {Router} = require('express');
const router = Router();
const miscellaneousController = require('../controllers/miscellaneousController.js');
const authMiddleware = require('../middleware/authMiddleware.js');

router.post('/api/search/:searchValue', (req, res, next) => {
    miscellaneousController.search(req, res, next);
});

module.exports = router;