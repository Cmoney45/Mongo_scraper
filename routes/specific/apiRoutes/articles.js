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

    // Get specific article
    app.get("api/articles/:id", (req, res) => {
        db.Article.findOne({ _id: req.params.id })
            .populate("note")
            .then(dbArticle => {
                res.json(dbArticle);
            })
            .catch(err => {
                res.json(err);
            });
    });

    // Post specific article to update
    app.post("/articles/:id", (req, res) => {
        db.Note.create(req.body)
            .then(dbNote => {
                return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
            })
            .then(dbArticle => {
                res.json(dbArticle);
            })
            .catch(err => {
                res.json(err);
            });
    });

};
