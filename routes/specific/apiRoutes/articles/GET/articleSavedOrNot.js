module.exports = (app, db) => {
    //Get all routes that are not favorited
    app.get("/api/articles", (req, res) => {

        console.log(req.query.saved)

        db.Article.find({saved: req.query.saved})
            .sort({articleScraped: -1})
            .then(dbArticleNotFavorite => {
                res.json(dbArticleNotFavorite);
            })
            .catch(err => {
                res.send(err);
                res.json(err);
            });
    });
};
