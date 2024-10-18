const router = require("express").Router();
const postController = require("../controllers/postController");
const commentController = require("../controllers/commentController");

router.get("/", postController.getPosts);
router.post("/", postController.createPost);
router.get("/:id", postController.getPostById);

router.get('/:id/comments', commentController.getComments);
router.post('/:id/comments', commentController.createComment);

module.exports = router;