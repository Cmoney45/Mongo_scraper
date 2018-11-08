module.exports = (app, db) => {
    //Get all routes that are not favorited
    app.get("/api/articles?saved=false", (req, res) => {
        db.Article.find({ favorite: false })
            .then(dbArticle => {
                res.json(dbArticle);
            })
            .catch(err => {
                res.json(err);
            });
    });
};
