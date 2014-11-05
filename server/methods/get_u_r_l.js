/*****************************************************************************/
/* GetURL Methods */
/*****************************************************************************/

var MAX_IMAGES = 250,
	TIMEOUT = 100000;

var urlRegex = /<a[^>]*>([\s\S]*?)<\/a>/g,
	Crawler = Meteor.npmRequire('crawler').Crawler,
	Future = Meteor.npmRequire('fibers/future');

Meteor.methods({
	/*
	 * Example:
	 *  '/app/get_u_r_l/update/email': function (email) {
	 *    Users.update({_id: this.userId}, {$set: {'profile.email': email}});
	 *  }
	 *
	 */
	'/app/get_u_r_l': function(url) {
		// if the url is of an image, just return the same url
		if (url.slice(-4) === '.jpg') return [url];
		// otherwise, crawl from that point
		var fut = new Future(),
			results = [],
			count = 0,
			timeout = new Date().getTime() + TIMEOUT;
			c = new Crawler({
				maxConnections: 10,
				callback: function(error,result,$) {
				    // $ is a jQuery instance scoped to the server-side DOM of the page
				    if (error || !$ || count > MAX_IMAGES || new Date() > timeout) {
				    	console.log(error);
				    	return null;
				    }
				    $("img").each(function(index,img) {
				    	if (results.indexOf(img.src) === -1) {
				    		results.push(img.src);
				    		count++;
				    	}
				    });
				    $("a").each(function(index,a) {
				    	if (a.href.indexOf(url) > -1) c.queue(a.href);
				    });
				},
				skipDuplicates: true,
				onDrain: function() {
					fut.return(results);
				}
			});
		x = c.queue(url);
		return fut.wait();
	}
});