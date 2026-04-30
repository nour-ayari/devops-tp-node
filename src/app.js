const express = require("express");

const app = express();

app.get("/", (req, res) => {
  res.status(200).json({ message: "DevOps TP Node.js app" });
});

app.get("/health", (req, res) => {
  res.status(200).json({ status: "UP" });
});

module.exports = app;

if (require.main === module) {
  app.listen(3000, () => {
    console.log("App running on port 3000");
  });
}