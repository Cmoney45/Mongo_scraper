module.exports = (app, db, path) => {
    require("./specific/apiRoutes")(app, db);
    require("./specific/htmlRoutes")(app, db, path);
};
