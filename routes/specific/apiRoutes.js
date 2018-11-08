module.exports = (app, db) => {
    require("./apiRoutes/articlesApi")(app, db);
    require("./apiRoutes/scrape")(app, db);
};
