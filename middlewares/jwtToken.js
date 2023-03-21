const jwt = require("jsonwebtoken");

module.exports = {
  signAccessToken: (user) => {
    return new Promise((resolve, reject) => {
      const payload = { user };
      // console.log(payload);
      const options = {
        expiresIn: "1d",
      };
      jwt.sign(payload, process.env.JWT_SECRET, options, (err, token) => {
        if (err) reject(err);
        resolve(token);
      });
    });
  },
  verifyAccessToken: (req, res) => {
    if (!req.headers["authorization"])
      return res.json({ message: "Access Denied" });

    const authHeader = req.headers["authorization"];

    const bearerToken = authHeader.split(" ");
    const token = bearerToken[1];

    jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
      if (err) return res.json({ message: err });

      // setTimeout(function () {
      //   process.on("exit", function () {
      //     require("child_process").spawn(process.argv.shift(), process.argv, {
      //       cwd: process.cwd(),
      //       detached: true,
      //       stdio: "inherit",
      //     });
      //   });

      //   process.exit();
      // }, 1000);

      res.json({
        id: payload.user._id,
        email: payload.user.email,
        startas: payload.user.startas,
      });
    });
  },
};
