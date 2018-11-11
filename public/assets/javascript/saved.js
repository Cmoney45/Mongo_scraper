$(document).ready(() => {
    // Store Article container to use throught JS
    const articleContainer = $(".article-container");

    // Load Page data
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

    //Start Rendering Articles
    const renderArticles = (articles) => {
        const articleCards = [];

        for (i in articles) {
            articleCards.push(createCard(articles[i], i));
        }
        articleContainer.append(articleCards);
    }

    // Create the card
    const createCard = (article) => {
        const card = $("<div class='card'>");
        const cardHeader = $("<div class='card-header bg-dark'>");
        const cardTitle = $("<h2>");
        const cardLink = $("<a class='article-link' target='_blank' rel='noopener noreferrer'> ")
        const buttonSpace =$(" ")
        cardLink.attr("href", article.link).text(article.title)

        const cardSaveButton = $("<a class='btn btn-success delete'>Remove from Saved</a>")
        const cardNoteButton = $(" <a class='btn btn-danger notes'>Notes</a>")
        const cardBody = $("<div class='card-body'>")
        const cardSnippet =$("<p>").text(article.snippet);

        card.append(cardHeader, cardBody);
        card.data("_id", article._id);
        cardHeader.append(cardTitle);
        cardTitle.append(cardLink);
        cardBody.append(cardSnippet, cardSaveButton, buttonSpace,cardNoteButton);
        card.append(cardHeader, cardBody);

        return card;
    }

    // Render if No cards
    const renderEmpty = () => {
        const empty = $(
            [
              "<div class='m-auto'>",
              "<div class='alert alert-warning text-center'>",
              "<h4>Woh Woh. Looks like we don't have any new articles.</h4>",
              "</div>",
              "<div class='card'>",
              "<div class='card-body text-center'>",
              "<h4><a class='scrape-new'>Scrape New Articles</a></h4>",
              "</div>",
              "</div>",
              "</div?"
            ].join("")
          );
        articleContainer.append(empty);
    }

    // Render the Notes list
    const renderNotesList = (data) => {
        const notesToRender = [];
        let currentNote;

        if (!data.notes.length) {
            currentNote = $("<li class='list-group-item'><p>No notes for this article yet.</p></li>");
            notesToRender.push(currentNote);
        } else {
            for (i in data.notes) {

                const newCurrentNote = $(`
                <div class="navbar">
                    <a class="navbar-brand">${data.notes[i].body}</a>
                    <button class="form-inline btn btn-danger note-delete">X</button>
                </div>`)

                newCurrentNote.children("button").data("_id", data.notes[i]._id);
                notesToRender.push(newCurrentNote);
            }
        }

        data.currentCard.find(".note-container").append(notesToRender);

    };

    // Action for un-saving an article
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

    // Action for when Notes button is pressed
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
                        notes: data.note || [],
                        currentCard
                    };
                    $(".btn.save").data("article", noteData);
                    renderNotesList(noteData);
                });
            return;
        };

        if (currentState === "Hide") {
            $(event.currentTarget).text("Notes")

            currentCard.children(".container-fluid").remove()

        }
    }

    // Action for when a note is to be saved
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

    // Delete a note
    const handleNoteDelete = (event) => {
        const noteToDelete = $(event.currentTarget).data("_id");
        const currentCard = $(event.currentTarget).parents(".card");

        $.ajax({
            url: `/api/notes/${noteToDelete}`,
            method: "DELETE"
        }).then(() => {
            currentCard.find(".notes").text("Notes")
            currentCard.children(".container-fluid").remove()
        });
    }

    initPage();
    $(document).on("click", ".btn.delete", handleArticleunSaved);
    $(document).on("click", ".btn.notes", handleArticleNotes);
    $(document).on("click", ".btn.save", handleNoteSave);
    $(document).on("click", ".btn.note-delete", handleNoteDelete);
});
