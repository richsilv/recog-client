/*****************************************************************************/
/* WikiSearch Methods */
/*****************************************************************************/

var wikipedia = Meteor.npmRequire("wikipedia-js"),
    Future = Meteor.npmRequire('fibers/future'),
    querystring = Meteor.npmRequire('querystring'),
    xml2js = Meteor.npmRequire('xml2js');

var parser = new xml2js.Parser(),
    wikiURL = 'http://en.wikipedia.org/w/api.php';

Meteor.methods({
    /*
     * Example:
     *  '/app/wiki_search/update/email': function (email) {
     *    Users.update({_id: this.userId}, {$set: {'profile.email': email}});
     *  }
     *
     */
    '/app/wiki_search/search': function(query) {
        var options = {
                query: query,
                format: "html",
                summaryOnly: true
            },
            fut = new Future();
        wikipedia.searchArticle(options, Meteor.bindEnvironment(function(err, htmlWikiText) {
            if (err) {
                console.log("An error occurred[query=%s, error=%s]", query, err);
                fut.throw(err);
            } else {
                console.log("Query successful[query=%s, html-formatted-wiki-text=%s]", query, htmlWikiText);
                fut.return(htmlWikiText);
            }
        }));
        return fut.wait();
    },
    '/app/wiki_search/opensearch': function(query) {
        var fut = new Future(),
            params = {
                action: 'opensearch',
                search: query,
                format: 'xml',
                limit: 50
            },
            url = wikiURL + '?' + querystring.stringify(params);
        HTTP.get(url, function(err, res) {
            if (err) {
                console.log(err)
                fut.throw(err);
            } else if (res.statusCode === 200) {
                parser.parseString(res.content, function(err, result) {
                    if (err) {
                        console.log(err);
                        fut.throw(err);
                    } else {
                        fut.return(result);
                    }
                });
            } else {
                fut.return("failure");
            }
        });
        return fut.wait();
    }
});