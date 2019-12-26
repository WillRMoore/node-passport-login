const express = require("express");
const router = express.Router();

router.get("/login", function(req, res) {
  res.send("Login page");
});

router.get("/signup", function(req, res) {
  res.send("Signup page");
});

module.exports = router;
