module.exports = (app, db) => {
    //Get all articles
    // require("./articles/GET/allArticles")(app, db);
    
    // Get all articles based on their Favorite or Not
    require("./articles/GET/articleFavsOrNot")(app, db);

    // Get specific article Notes
    require("./articles/GET/specificArticleNotes")(app, db);

    // Post specific article to update
    require("./articles/POST/specificArticleNote")(app, db);

    // Update Favorite Article
    require("./articles/PUT/favoriteArticle")(app, db);
};
