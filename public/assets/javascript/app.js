$(document).ready(() => {

  const initPage = () => {
    $.get("/api/articles").then(data => {
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
    for ( i in articles ) {
      articleCards.push(createCard(articles[i]));
    }
    articleContainer.append(articleCards);
  }

  const createCard = (article) => {

    const card = $("<div class='card'>");
    const cardHeader = $("<div class='card-header'>");
    const cardTitle = $("<h2>");
    const cardLink = $("<a class='article-link' target='_blank' rel='noopener noreferrer'>").attr("href", article.link).text(article.title)
    const cardButton = $("<a class='btn btn-success save'>Save Article</a>")
    const cardBody = $("<div class='card-body'>").text(article.snippet);
   
    card.append(cardHeader, cardBody);
    card.data("_id", article._id);
    cardHeader.append(cardTitle);
    cardTitle.append(cardLink, cardButton);

    return card;
  };

  const renderEmpty = () => {

    const emptyAlert = $(
      [
        "<div class='alert alert-warning text-center'>",
        "<h4>Uh Oh. Looks like we don't have any new articles.</h4>",
        "</div>",
        "<div class='card'>",
        "<div class='card-header text-center'>",
        "<h3>What Would You Like To Do?</h3>",
        "</div>",
        "<div class='card-body text-center'>",
        "<h4><a class='scrape-new'>Try Scraping New Articles</a></h4>",
        "<h4><a href='/saved'>Go to Saved Articles</a></h4>",
        "</div>",
        "</div>"
      ].join("")
    );
    articleContainer.append(emptyAlert);
  };

  const handleArticleSave = () => {

    const articleToSave = $(this).parents(".card").data();
    $(this).parents(".card").remove();

    articleToSave.saved = true;
    $.ajax({
      method: "PUT",
      url: "/api/headlines/" + articleToSave._id,
      data: articleToSave
    }).then(function(data) {
      if (data.saved) {
        initPage();
      }
    });
  };

  const handleArticleScrape = () => {
    $.get("/api/scrape").then(data => {

      initPage();
      bootbox.alert($("<h3 class='text-center m-top-80'>").text(data.message));
    });
  };

  const handleArticleClear = () => {
    $.get("api/clear").then(() => {
      articleContainer.empty();
      initPage();
    });
  }

  initPage();
  const articleContainer = $(".article-container");
  $(document).on("click", ".btn.save", handleArticleSave);
  $(document).on("click", ".scrape-new", handleArticleScrape);
  $(".clear").on("click", handleArticleClear);
});
