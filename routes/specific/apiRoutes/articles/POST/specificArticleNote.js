module.exports = (app, db) => {
    app.post("/api/articles/:id", (req, res) => {
        const { id } = req.params;

        db.Note.create(req.body)

            .then(dbNote => db.Article.findByIdAndUpdate(id, 
                    { $push: { note: dbNote._id } }, 
                    { new: true })
            )
            .then(updatedArticle => {
                res.json(updatedArticle);
            })
            .catch(error => {
                res.json(error);
            })
    });
}