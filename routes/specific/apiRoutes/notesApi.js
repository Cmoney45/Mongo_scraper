module.exports = (app, db) => {

    // Get specific Articles Notes
    require("./notes/DELETE/deleteNote")(app, db);

};
