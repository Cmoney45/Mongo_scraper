const path = require("path");
const express = require("express");

module.exports = (app, db) => {
    app.use(express.static('public'))

    app.get("/saved", (req, res) => {
        res.sendFile(path.join(__dirname, "/../../public/saved.html"));
    });

    app.get("/", function(req, res) {
        res.sendFile(path.join(__dirname, "/../../public/index.html"));
      });
};
