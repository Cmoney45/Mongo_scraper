const axios = require("axios");
const cheerio = require("cheerio");

module.exports = (app, db) => {
    app.get("/api/scrape", function(req, res) {
        axios.get("https://www.nytimes.com/").then(function(response) {
          var $ = cheerio.load(response.data);
      
          $("article.css-180b3ld").each(function(i, element) {
            var result = {};
      
            result.title = $(this).children().text();
            result.link = $(this).children("a").attr("href");
      
            db.Article.create(result)
              .then(function(dbArticle) {
                console.log(dbArticle);
              })
              .catch(function(err) {
                return res.json(err);
              });
          });
      
          res.send("Scrape Complete");
        });
      });
      
};
