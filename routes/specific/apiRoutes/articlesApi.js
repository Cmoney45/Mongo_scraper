module.exports = (app, db) => {
    //Get all articles
    // require("./articles/GET/allArticles")(app, db);
    
    // Get all articles based on their Saved or Not
    require("./articles/GET/articleSavedOrNot")(app, db);

    // Get specific article Notes
    require("./articles/GET/specificArticleNotes")(app, db);

    // Post specific article to update
    require("./articles/POST/specificArticleNote")(app, db);

    // Update Saved Article
    require("./articles/PUT/savedArticle")(app, db);

    // Delete all articles that aren't favorited
    require("./articles/DELETE/allNonSaved")(app, db);
};
