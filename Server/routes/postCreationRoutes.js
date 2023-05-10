const {Router} = require('express');
const router = Router();
const authMiddleware = require('../middleware/authMiddleware');
const postCreationController = require('../controllers/postCreationController.js');



router.get('/api/newpost/get_signature', (req, res, next) => {
    console.log(req.body);
    postCreationController.get_signature(req, res, next);
});

router.post('/api/newpost/make_post', authMiddleware, (req, res, next) => {
    postCreationController.make_post(req, res, next);
});

router.post('/api/newpost/usergroups', authMiddleware, async(req, res, next) => {
    postCreationController.userGroups(req, res, next);
})

module.exports = router;