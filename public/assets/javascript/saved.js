$(document).ready(() => {
    const articleContainer = $(".article-container");

    const initPage = () => {
        $.get("/api/articles?favorite=true").then(data => {

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
            articleCards.push(createCard(articles[i]));
        }
        articleContainer.append(articleCards);
    }

    const createCard = (article) => {
        const card = $("<div class='card'>");
        const cardHeader = $("<div class='card-header'>");
        const cardTitle = $("<h2>");
        const cardLink = $("<a class='article-link' target='_blank' rel='noopener noreferrer'>")
            .attr("href", article.link).text(article.title)

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
            // If we have no notes, just display a message explaining this
            currentNote = $("<li class='list-group-item'>No notes for this article yet.</li>");
            notesToRender.push(currentNote);
        } else {
            // If we do have notes, go through each one
            for ( i in data.notes ) {
                // Constructs an li element to contain our noteText and a delete button
                currentNote = $("<li class='list-group-item note'>")
                    .text(data.notes[i].body)
                    .append($("<button class='btn btn-danger note-delete'>x</button>"));
                // Store the note id on the delete button for easy access when trying to delete
                currentNote.children("button").data("_id", data.notes[i]._id);
                // Adding our currentNote to the notesToRender array
                notesToRender.push(currentNote);
            }
        }
        // Now append the notesToRender to the note-container inside the note modal
        $(".note-container").append(notesToRender);
    }

    const handleArticleDelete = (event) => {
        const articleToDelete = $(event.currentTarget)
            .parents(".card")
            .data();

        $(event.currentTarget)
            .parents(".card")
            .remove();

        $.ajax({
            method: "DELETE",
            url: `/api/articles/${articleToDelete._id}`
        }).then(function (data) {
            // If this works out, run initPage again which will re-render our list of saved articles
            if (data.ok) {
                initPage();
            }
        });
    }
    const handleArticleNotes = (event) => {
        const currentArticle = $(event.currentTarget)
            .parents(".card")
            .data();

        $.get(`/api/articles/${currentArticle._id}`).then(data => {
            // Constructing our initial HTML to add to the notes modal
            console.log(data);
            const modalText = $("<div class='container-fluid text-center'>").append(
                $("<h4>").text(`Notes For Article: ${currentArticle._id}`),
                $("<hr>"),
                $("<ul class='list-group note-container'>"),
                $("<textarea placeholder='New Note' rows='4' cols='60'>"),
                $("<button class='btn btn-success save'>Save Note</button>")
            );
            // Adding the formatted HTML to the note modal
            bootbox.dialog({
                message: modalText,
                closeButton: true
            });
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
    }

    const handleNoteSave = (event) => {
        let noteData;
        const newNote = $(".bootbox-body textarea").val().trim();
        const articleId = $(event.currentTarget).data("article")._id;
        // If we actually have data typed into the note input field, format it
        // and post it to the "/api/articles" route and send the formatted noteData as well
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
                // When complete, close the modal
                bootbox.hideAll();
            });
        }
    }

    const handleNoteDelete = (event) => {
        // This function handles the deletion of notes
        const noteToDelete = $(event.currentTarget).data("_id");
        // Perform an DELETE request to "/api/notes/" with the id of the note we're deleting as a parameter
        $.ajax({
            url: `/api/notes/${noteToDelete}`,
            method: "DELETE"
        }).then(() => {
            // When done, hide the modal
            bootbox.hideAll();
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
    $(document).on("click", ".btn.delete", handleArticleDelete);
    $(document).on("click", ".btn.notes", handleArticleNotes);
    $(document).on("click", ".btn.save", handleNoteSave);
    $(document).on("click", ".btn.note-delete", handleNoteDelete);
    $(".clear").on("click", handleArticleClear);
});
