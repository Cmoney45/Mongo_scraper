module.exports = (app, db) => {
    //Get all routes that are not favorited
    app.get("/api/articles", (req, res) => {

        console.log(req.query.favorite)

        db.Article.find({favorite: req.query.favorite})
            .then(dbArticleNotFavorite => {
                res.json(dbArticleNotFavorite);
            })
            .catch(err => {
                res.send(err);
                res.json(err);
            });
    });
};
