module.exports = (app, db) => {
    //Get all routes that are favorited
    app.get("/api/articles?saved=true", (req, res) => {
        db.Article.find({ favorite: true })
            .then(dbArticle => {
                res.json(dbArticle);
            })
            .catch(err => {
                res.json(err);
            });
    });
}