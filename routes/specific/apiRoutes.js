module.exports = (app, db) => {
    require("./apiRoutes/articles")(app, db);
    require("./apiRoutes/scrape")(app, db);
};
