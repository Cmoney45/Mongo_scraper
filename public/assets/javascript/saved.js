$(document).ready(() => {
    const articleContainer = $(".article-container");

    const initPage = () => {
        $.get("/api/articles?saved=true").then(data => {

            articleContainer.empty();
            if (data && data.length) {
                renderArticles(data);
            } else {
                renderEmpty();
            }
        });
    }

    const renderArticles = (articles) => {
        const articleCards = [];

        for (i in articles) {
            articleCards.push(createCard(articles[i], i));
        }
        articleContainer.append(articleCards);
    }

    const createCard = (article, i) => {
        const card = $("<div class='card'>");
        const cardHeader = $("<div class='card-header'>");
        const cardTitle = $("<h2>");
        const cardLink = $("<a class='article-link' target='_blank' rel='noopener noreferrer'>")
        cardLink.attr("href", article.link).text(article.title)

        const cardButton = $("<a class='btn btn-success delete'>Remove from Saved</a>")
        const cardNoteButton = $("<a class='btn btn-danger notes'>Notes</a>")
        const cardBody = $("<div class='card-body'>").text(article.snippet);

        card.append(cardHeader, cardBody);
        card.data("_id", article._id);
        cardHeader.append(cardTitle);
        cardTitle.append(cardLink, cardButton, cardNoteButton);
        card.append(cardHeader, cardBody);

        return card;
    }

    const renderEmpty = () => {
        const emptyAlert = $(
            [
                "<div class='alert alert-warning text-center'>",
                "<h4>Uh Oh. Looks like we don't have any saved articles.</h4>",
                "</div>",
                "<div class='card'>",
                "<div class='card-header text-center'>",
                "<h3>Would You Like to Browse Available Articles?</h3>",
                "</div>",
                "<div class='card-body text-center'>",
                "<h4><a href='/'>Browse Articles</a></h4>",
                "</div>",
                "</div>"
            ].join("")
        );
        articleContainer.append(emptyAlert);
    }

    const renderNotesList = (data) => {
        // This function handles rendering note list items to our notes modal
        const notesToRender = [];
        let currentNote;

        if (!data.notes.length) {
            currentNote = $("<li class='list-group-item'><p>No notes for this article yet.</p></li>");
            notesToRender.push(currentNote);
        } else {
            for (i in data.notes) {

                const newCurrentNote = $(`<div class="navbar">
                <a class="navbar-brand">${data.notes[i].body}</a>
                  <button class="form-inline btn btn-danger note-delete">X</button>

              </div>`)

                newCurrentNote.children("button").data("_id", data.notes[i]._id);
                notesToRender.push(newCurrentNote);
            }
        }
        // Now append the notesToRender to the note-container inside the note modal
        $(".note-container").append(notesToRender);
    }

    const handleArticleunSaved = (event) => {

        let articleToSave = $(event.currentTarget)
            .parents(".card")
            .data();

        $(event.currentTarget)
            .parents(".card")
            .remove();

        articleToSave.saved = false;
        $.ajax({
            method: "PUT",
            url: `/api/articles/${articleToSave._id}?saved=false`,
            data: articleToSave
        }).then(data => {
            if (data.saved) {
                initPage();
            }
        });
    };

    const handleArticleNotes = (event) => {
        const currentArticle = $(event.currentTarget)
            .parents(".card")
            .data();
        const currentCard = $(event.currentTarget)
            .parents(".card");
        const currentState = $(event.currentTarget).text();

        if (currentState === "Notes") {

            $(event.currentTarget).text("Hide")

            $.get(`/api/articles/${currentArticle._id}`)
                .then(data => {
                    const noteCard = $("<div class='container-fluid'>");
                    const noteHeader = $("<h3>").text(`Notes:`);
                    const noteList = $("<ul class='list-group note-container'>");

                    const newNoteInput = $(`<hr>
                    <div class="input-group">
                        
                        <textarea class="form-control" aria-label="With textarea" placeholder="Write new note here!"></textarea>
                        <div class="input-group-append" id="button-addon4">
                            <button class="btn btn-success save" type="button">Save</button>
                        </div>
                    </div>`)
                    noteCard.append(noteHeader, noteList, newNoteInput)

                    currentCard.append(noteCard);
                    const noteData = {
                        _id: currentArticle._id,
                        notes: data.note || []
                    };
                    // Adding some information about the article and article notes to the save button for easy access
                    // When trying to add a new note
                    $(".btn.save").data("article", noteData);
                    // renderNotesList will populate the actual note HTML inside of the modal we just created/opened
                    renderNotesList(noteData);
                });
            return;
        };

        if (currentState === "Hide") {
            $(event.currentTarget).text("Notes")

            currentCard.children(".container-fluid").remove()

        }
    }

    const handleNoteSave = (event) => {
        let noteData;
        const newNote = $(event.currentTarget).parents().siblings("textarea").val().trim();
        const articleId = $(event.currentTarget).data("article")._id;
        const currentCard = $(event.currentTarget).parents(".card");

        if (newNote) {
            noteData = {
                body: newNote,
                article: articleId
            };
            $.post(
                `/api/articles/${articleId}`,
                noteData
            )
                .then((data) => {
                    currentCard.find(".notes").text("Notes")
                    currentCard.children(".container-fluid").remove()
                });
        }
    }

    const handleNoteDelete = (event) => {
        const noteToDelete = $(event.currentTarget).data("_id");
        const currentCard = $(event.currentTarget).parents(".card");

        $.ajax({
            url: `/api/notes/${noteToDelete}`,
            method: "DELETE"
        }).then(() => {
            // When done, hide the modal
            currentCard.find(".notes").text("Notes")
            currentCard.children(".container-fluid").remove()
        });
    }

    const handleArticleClear = () => {
        $.delete("api/articles/clear")
            .then(() => {
                articleContainer.empty();
                initPage();
            });
    }

    initPage();
    $(document).on("click", ".btn.delete", handleArticleunSaved);
    $(document).on("click", ".btn.notes", handleArticleNotes);
    $(document).on("click", ".btn.save", handleNoteSave);
    $(document).on("click", ".btn.note-delete", handleNoteDelete);
    $(".clear").on("click", handleArticleClear);
});
