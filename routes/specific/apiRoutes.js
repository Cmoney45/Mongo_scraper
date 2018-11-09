module.exports = (app, db) => {
    // Article Api Routes
    require("./apiRoutes/articlesApi")(app, db);
    // Note Api Routes
    require("./apiRoutes/notesApi")(app, db);
    // Scrape Api Routes
    require("./apiRoutes/scrape")(app, db);
};
