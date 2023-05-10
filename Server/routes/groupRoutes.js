const {Router} = require('express');
const router = Router();
const groupController = require('../controllers/groupControllers.js');
const authMiddleware = require('../middleware/authMiddleware.js');

router.post('/api/newgroup/make_group', authMiddleware ,async(req, res, next) => {
    groupController.createGroup(req, res, next);
});


router.post('/api/group/:groupname', authMiddleware, async(req, res, next) => {
    groupController.retrieveGroupData(req, res, next);
})

router.post('/api/notifications', authMiddleware ,async(req, res, next) => {
    groupController.getNotifications(req, res, next);
});

router.post('/api/delete/notifications', authMiddleware ,async(req, res, next) => {
    groupController.deleteNotifications(req, res, next);
});

router.post('/api/add/member', authMiddleware, async(req, res, next) => {
    groupController.addMember(req, res, next);
});

router.post('/api/remove/member', authMiddleware, async(req, res, next) => {
    groupController.removeMember(req, res, next);
});

router.post('/api/groupposts', authMiddleware, async(req, res, next) => {
    groupController.retrieveGroupPosts(req, res, next);
});





module.exports = router;
