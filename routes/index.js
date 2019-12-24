const express = require("express");
const router = express.Router();

router.get("/", function(req, res) {
  res.send("Hello world, this is the home page.");
});

module.exports = router;
