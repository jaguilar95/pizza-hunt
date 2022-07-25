const express = require("express");
const router = express.Router();
const pizzaRoutes = require("./pizza-routes");
const CommentRoutes = require("./comment-routes");

router.use("/pizzas", pizzaRoutes);
router.use("/comments", CommentRoutes);

module.exports = router;
