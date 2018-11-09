module.exports = (app, db) => {
    app.delete("/api/articles/clear", (req, res) => {

        db.Article.deleteMany({ favorite: false })
        .then(deletedArticles => {
            console.log(deletedArticles);
            res.json(deletedArticles);
        })
        .catch(error => {
            res.json(error);
        })
    });
}