module.exports = (app, db) => {
    app.delete("/api/notes/:id", (req, res) => {
        const noteid = req.params.id;
        //Find the note in the note DB
        db.Note.findById(noteid)
            .then(dbnote => {
                // Then find the Article it relates too and pull out the note ID from it's note array
                db.Article.findByIdAndUpdate(dbnote.article, { $pull: { note: noteid } }, { new: true })
                    // Then go back to the note array and remove it
                    .then(dbArticleWithRemovedNote => {
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
