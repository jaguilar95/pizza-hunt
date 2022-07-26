const express = require("express");
const router = express.Router();
const {
  addComment,
  removeComment,
  addReply,
  removeReply,
} = require("../../controllers/comment-controller");

// add a comment route to pizza path
router.route("/:pizzaId").post(addComment);

// delete a comment and remove from a pizza path
router.route("/:pizzaId/:commentId").put(addReply).delete(removeComment);

router.route("/:pizzaId/:commentId/:replyId").delete(removeReply);

module.exports = router;
