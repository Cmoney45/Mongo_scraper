module.exports = (app, db) => {
    //Update Specific article with its notes
    app.put("/api/articles/:id", (req, res) => {
        
        const { id } = req.params;

        db.Article.findByIdAndUpdate(id, { $set: { favorite: true }})
            .then(dbArticle => {
                res.json(dbArticle);
            })
            .catch(err => {
                res.json(err);
            });
    });
};
