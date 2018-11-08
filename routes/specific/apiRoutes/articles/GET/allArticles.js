module.exports = (app, db) => {
    //Get all articles
    app.get("/api/articles", (req, res) => {
        db.Article.find({})
            .then(dbArticle => {
                res.json(dbArticle);
            })
            .catch(err => {
                res.json(err);
            });
    });
};
