const {Router} = require('express');
const router = Router();
const postController = require('../controllers/postController.js');
const authMiddleware = require('../middleware/authMiddleware.js');

router.post('/api/post/:id', async(req, res, next) => {
    postController.retrievePostData(req, res, next);
})

router.get('/api/comments/:id', async(req, res, next) => {
    postController.retrievePostComments(req, res, next);

})

router.post('/api/new/comment', authMiddleware, async(req, res, next) => {
    postController.makeNewComment(req, res, next);
})

router.post('/api/upvote/post/:id', authMiddleware, async(req, res, next) => {
    postController.upvotePost(req, res, next)
})

router.post('/api/downvote/post/:id', authMiddleware, async(req, res, next) => {
    postController.downvotePost(req, res, next)
})



module.exports = router;