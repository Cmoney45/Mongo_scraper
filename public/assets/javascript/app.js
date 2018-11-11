$(document).ready(() => {

  // Start loading the page
  const initPage = () => {
    $.get("/api/articles?saved=false")
    .then(data => {
      articleContainer.empty();
      if (data && data.length) {
        renderArticles(data);
      } else {
        renderEmpty();
      }
    });
  }

  // Start rendering the articles
  const renderArticles = (articles) => {
    const articleCards = [];
    for ( i in articles ) {
      articleCards.push(createCard(articles[i]));
    }
    articleContainer.append(articleCards);
  }

  // Create the cards for the articles
  const createCard = (article) => {

    const cardColumn = $("<div class='col-lg-3 col-md-4'>")
    const card = $("<div class='card'>");
    const cardHeader = $("<div class='card-header bg-dark'>");
    const cardTitle = $("<h2>");
    const cardLink = $("<a class='article-link' target='_blank' rel='noopener noreferrer'>")
    cardLink.attr("href", article.link).text(article.title)

    const cardSaveButton = $("<a class='btn btn-success save'>Save Article</a>")
    const cardBody = $("<div class='card-body'>")
    const cardSnippet =$("<p>").text(article.snippet);

    cardColumn.append(card);
    card.append(cardHeader, cardBody);

    cardHeader.append(cardTitle);
    cardTitle.append(cardLink);

    cardBody.append(cardSnippet, cardSaveButton);
    card.data("_id", article._id);

    return cardColumn;
  };

  // If no articles are in database
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
  };

  // Save an article
  const handleArticleSave = (event) => {

    let articleToSave = $(event.currentTarget)
      .parents(".card")
      .data();

    $(event.currentTarget)
      .parents(".card")
      .remove();

    articleToSave.saved = true;
    $.ajax({
      method: "PUT",
      url: `/api/articles/${articleToSave._id}?saved=true`,
      data: articleToSave
    }).then(data => {
      if (data.saved) {
        initPage();
      }
    });
  };

  // Scrape new articles
  const handleArticleScrape = () => {
    $.get("/api/scrape").then(data => {
      initPage();
    });
  };

  // Clear all articles
  const handleArticleClear = () => {
    $.ajax({
      method: "DELETE",
      url:"/api/articles/clear"
    })
    .then(() => {
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
