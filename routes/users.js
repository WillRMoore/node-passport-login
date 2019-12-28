const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");

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

        // console.log(newUser);
        // res.send(newUser);
        // res.render("dashboard", {
        //   user: {
        //     name: name
        //   }
        // });
      }
    });
  }

  // console.log(req.body);
  // res.send(`Name: ${name}, Email: ${email}, Password: ${password}`);
});

// Login Handle
router.post("/login", (req, res) => {
  console.log(req.body);
  res.send(req.body);
});

module.exports = router;
