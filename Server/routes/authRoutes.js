const {Router} = require('express');
const router = Router();
const authController = require('../controllers/authController.js');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/api/signup', (req, res, next) => {
    authController.signupHandler(req, res, next);
})

router.post('/api/login', (req, res, next) => {
    authController.loginHandler(req, res, next);
})

router.post('/api/authorize', authMiddleware, (req, res, next) => {
    res.json({isAuthorized: true});
})

module.exports = router;
