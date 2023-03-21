const { iconsList } = require("material-icons-list");

exports.getIcons = async (req, res) => {
    try {
      res.json({ iconsList });
    } catch {
      res.status(400).json({ error: "Read Icons Details failed." });
    }
  };