const axios = require("axios");
const cheerio = require("cheerio");

module.exports = (app, db) => {
    app.get("/api/scrape", function (req, res) {
        axios.get("https://www.nytimes.com/").then(response => {
            var $ = cheerio.load(response.data);
            $("h2").each((i, element) => {
                const result = {};

                result.title = $(element).text();

                result.snippet = $(element).parent().siblings("p").text()

                result.link = `https://www.nytimes.com${$(element).parent().parent("a").attr("href")}`;
                if (
                    result.title !== null && result.title !== ""
                    && result.snippet !== null && result.snippet !== ""
                    && result.link !== null && result.link !== ""
                ) {

                    db.Article.find({ title: result.title })
                        .then(dbArticle => {
                            // console.log(dbArticle);
                            if (dbArticle.length === 0) {
                                db.Article.create(result)
                                    .then(function (dbArticle) {
                                        console.log(dbArticle);
                                    })
                                    .catch(function (err) {
                                        return res.json(err);
                                    });
                            }
                        })
                        .catch(err => {
                            console.log(err);
                        });
                };
            });

            res.send("Scrape Complete");
        });
    });

};
