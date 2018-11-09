module.exports = (app, db) => {
    //Get Specific article with its notes
    app.get("/api/notes/:id", (req, res) => {
        db.Article.findOne({ _id: req.params.id })
            .populate("note")
            .then(dbArticle => {
                res.json(dbArticle);
            })
            .catch(err => {
                res.json(err);
            });
    });
};
