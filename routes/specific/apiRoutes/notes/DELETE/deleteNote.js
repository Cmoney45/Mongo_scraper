module.exports = (app, db) => {
    app.delete("/api/notes/:id", (req, res) => {
        const noteid = req.params.id;
        db.Note.findById(noteid)
            .then(dbnote => {
                console.log(dbnote);
                db.Article.findByIdAndUpdate(dbnote.article, { $pull: { note: noteid } }, { new: true })
                    .then(dbArticleWithRemovedNote => {
                        console.log(dbArticleWithRemovedNote);

                        db.Note.findByIdAndRemove(noteid, (error, removedNote) => {
                            if (error) {
                                console.log(error);
                                res.status(500).send(error);
                            } else {
                                console.log(`The following has been removed: ${removedNote}`);
                                res.status(200).send(removedNote);
                            };
                        });
                    });
            });

    });
};
