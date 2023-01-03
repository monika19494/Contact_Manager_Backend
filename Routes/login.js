const router = require("express").Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../Models/user");
const { body, validationResult } = require("express-validator");
const dotenv = require("dotenv");
const { json } = require("express");
dotenv.config();

router.use(require("express").json());

router.post(
  "/register",
  async (req, res) => {
    console.log("req", req.body);
    const { email, password } = req.body;
    try {
      const error = validationResult(req);
      if (!error.isEmpty()) {
        res.status(400).json({ message: error.array() });
      }
      //checking whether user already exists
      const userAlreadyExists = await User.findOne({ email });
      if (userAlreadyExists)
        return res.status(400).json({
          error: `User with this email [${email}] already exists so please try another one.`,
        });

      //bcrypt password
      bcrypt.hash(password, 10, async function (err, hash) {
        if (err) {
          return res.status(400).json({ message: err.message });
        }

        const data = await User.create({
          email,
          password: hash,
        });
        //console.log(data);
        res.status(200).json({
          status: "success",
          message: "Registration Successful",
        });
      });
    } catch (e) {
      console.log(e);
      return res.status(500).json({ error: e.message });
    }
  }
);

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const userData = await User.findOne({ email: email });
  if (userData != null) {
    let result = await bcrypt.compare(password, userData.password);
    if (result) {
      const token = jwt.sign(
        {
          exp: Math.floor(Date.now() / 10) + 60 * 60,
          data: userData._id,
        },
        process.env.JWT_KEY
      );
      res.status(200).json({
        Status: "Successful",
        token: token,
      });
    } else {
      res.status(400).json({
        status: "failed",
        message: "Wrong Password",
      });
    }
  } else {
    res.status(400).json({
      status: "failed",
      message: "No user Found",
    });
  }
});

module.exports = router;
