const jwt = require("jsonwebtoken");
const User = require("../Models/user");

const validateToken = (req, res, next) => {
  const tokenAccess = req.header("token");

  if (!tokenAccess) {
    return res.status(400).json({ message: "User is not logged in" });
  }
  try {
    jwt.verify(tokenAccess, process.env.JWT_KEY, async (err, decode) => {
      if (err) {
        return res.status(400).json({ message: err.message });
      }
      const data = await User.findOne({ _id: decode.data });
      if (data) {
        req.user = data._id;
        console.log("creating-",req.user)
        next();
      } else {
        res.json({ message: "failed" });
      }
    });
  } catch (e) {
    res.status(400).json({ message: err.message });
  }
};

module.exports = { validateToken };
