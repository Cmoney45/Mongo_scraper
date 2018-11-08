module.exports = (app, db) => {
    //Get all articles
    require("./articles/GET/allArticles")(app, db);

    // Get all routes that are not favorited
    require("./articles/GET/allArticlesNotFavorited")(app, db);

    //Get all routes that are favorited
    require("./articles/GET/allArticlesFavorited")(app, db);

    // Get specific article
    require("./articles/GET/specificArticle")(app, db);

    // Post specific article to update
    require("./articles/POST/specificArticleNote")(app, db);

    // Update Favorite Article
    require("./articles/PUT/favoriteArticle")
};
