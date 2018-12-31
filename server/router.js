var router = require("express").Router();
var controller = require("./controller.js");

router
  .route("/player")
  .get(controller.get)
  .patch(controller.patch)

  module.exports = router;