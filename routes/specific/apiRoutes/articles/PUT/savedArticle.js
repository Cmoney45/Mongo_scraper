module.exports = (app, db) => {
    //Update Specific article with its notes
    app.put("/api/articles/:id", (req, res) => {
        
        const { id } = req.params;
        const savedValue = req.query.saved;

        db.Article.findByIdAndUpdate(id, { $set: { saved: savedValue }, }, { new: true })
            .then(dbArticle => {
                res.json(dbArticle);
            })
            .catch(err => {
                res.json(err);
            });
    });
};
