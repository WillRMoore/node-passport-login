const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const passport = require("passport");

// User model
const User = require("../models/User");

router.get("/login", (req, res) => {
  res.render("login");
});

router.get("/signup", (req, res) => {
  res.render("signup");
});

// Sign-up Handle
router.post("/signup", (req, res) => {
  const { name, email, password } = req.body;
  let errors = [];

  // validation
  if (!name || !email || !password) {
    errors.push({ msg: "Please fill out all fields" });
  }

  // check password length
  if (password.length < 6) {
    errors.push({ msg: "Password should be at least 6 characters" });
  }

  if (errors.length > 0) {
    res.render("signup", {
      errors: errors,
      name,
      email
    });
  } else {
    User.findOne({ email: email }).then(user => {
      if (user) {
        // user exists
        errors.push({ msg: "That email is already registered" });
        res.render("signup", {
          errors: errors,
          name,
          email
        });
      } else {
        // create new user
        const newUser = new User({
          name,
          email,
          password
        });

        // hash password
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) {
              throw err;
            }

            // set password to hash
            newUser.password = hash;
            // save user
            newUser
              .save()
              .then(user => {
                req.flash(
                  "success_msg",
                  "You are now registered and can login."
                );
                res.redirect("/users/login");
              })
              .catch(err => console.log(err));
          });
        });
      }
    });
  }
});

// Login Handle
router.post("/login", (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/dashboard",
    failureRedirect: "/users/login",
    failureFlash: true
  })(req, res, next);
});

// Logout
router.get("/logout", (req, res) => {
  // log user out with passport
  req.logout(); // this is a passport method
  req.flash("success_msg", "You are logged out");
  res.redirect("/users/login");
});

module.exports = router;
