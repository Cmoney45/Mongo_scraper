module.exports = (app, db) => {

    require("./specific/apiRoutes")(app, db);
    require("./specific/htmlRoutes")(app, db);

};
