/*****************************************************************************/
/* WikiSearch Methods */
/*****************************************************************************/

var wikipedia = Meteor.npmRequire("wikipedia-js"),
	Future = Meteor.npmRequire('fibers/future');

Meteor.methods({
	/*
	 * Example:
	 *  '/app/wiki_search/update/email': function (email) {
	 *    Users.update({_id: this.userId}, {$set: {'profile.email': email}});
	 *  }
	 *
	 */
	'/app/wiki_search': function(query) {
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
	}
});