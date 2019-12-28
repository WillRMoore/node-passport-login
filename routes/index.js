const express = require("express");
const router = express.Router();
const { ensureAuthenticated } = require("../config/auth");

router.get("/", function(req, res) {
  res.render("welcome");
});

router.get("/dashboard", ensureAuthenticated, (req, res) => {
  console.log("req.user:", req.user);
  res.render("dashboard", {
    user: req.user
  });
});

module.exports = router;
