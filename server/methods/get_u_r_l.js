/*****************************************************************************/
/* GetURL Methods */
/*****************************************************************************/

var MAX_IMAGES = 2500,
	TIMEOUT = 30000,
	MIN_TIMEOUT = 5000;

var urlRegex = /<a[^>]*>([\s\S]*?)<\/a>/g,
	Crawler = Meteor.npmRequire('crawler'),
	Future = Meteor.npmRequire('fibers/future'),
	pathReg = /^https?:\/\//i,
	urlParse = Meteor.npmRequire('url'),
	http = Meteor.npmRequire('http'),
	sizeOf = Meteor.npmRequire('image-size');

function url_domain(data) {
	var a = document.createElement('a');
	a.href = data;
	return a.hostname;
}

Meteor.methods({
	/*
	 * Example:
	 *  '/app/get_u_r_l/update/email': function (email) {
	 *    Users.update({_id: this.userId}, {$set: {'profile.email': email}});
	 *  }
	 *
	 */
	'/app/get_u_r_l': function(url) {

		var imageAdd = function(url) {
			var options = urlParse.parse(url),
				fut = new Future();

			http.get(options, Meteor.bindEnvironment(function(response) {
				var l = 0,
				    chunks = [];
				response.on('data', Meteor.bindEnvironment(function(chunk) {
					chunks.push(chunk);
					l += chunk.length;
					console.log(l);
					if (l > 12000) response.destroy();
				}));
				response.on('end', Meteor.bindEnvironment(function() {
					buffer = Buffer.concat(chunks);
					var size = sizeOf(buffer);
					if (size.height > 200 && size.width > 200) {
						LocalImages.insert({url: url});
						console.log("Added image " + url);
						fut.return(1);
					}
					else fut.return(0);
				}));
			}, function(e) {console.log("BIND ERROR", e);}));
			return fut.wait();
		};

		var safeImageAdd = Meteor.bindEnvironment(imageAdd, function(e) {console.log("BIND ERROR", e)});

		// if the url is of an image, just return the same url
		if (url.slice(-4) === '.jpg') return [url];
		// otherwise, crawl from that point
		var fut = new Future(),
			results = [],
			urlList = [],
			count = 0,
			minTimeout = new Date().getTime() + MIN_TIMEOUT,
			maxTimeout = new Date().getTime() + TIMEOUT,
			urlHost = urlParse.parse(url).hostname,
			pastec = Pastec._id(),
			timeout = null,
			host = Control._id(),
			_this = this;
		c = new Crawler({
			maxConnections: 750,
			callback: Meteor.bindEnvironment(function(error, result, $) {
				// $ is a jQuery instance scoped to the server-side DOM of the page
				_this.unblock();
				var timeNow = new Date().getTime(),
					imageCount = LocalImages.find().count(),
					crawler = this;
				if (imageCount > MAX_IMAGES || timeNow > maxTimeout) {
					console.log("Too many images or Timeout");
/*					c.pool.drain(function() {
					    c.pool.destroyAllNow();
					});*/
					return null;
				}
				if (error || !$) {
					if (error) console.log("ERROR", error.message);
					return null;
				}
				$('a, img[src$=".jpg"]').each(Meteor.bindEnvironment(function(index, tag) {
					if (tag.tagName === "IMG") {
						var img = tag;
						if (imageCount < MAX_IMAGES &&
							!LocalImages.findOne({
								url: img.src
							}) &&
							!Images.findOne({
								url: img.src,
								pastec: pastec,
								host: host
							})) {
							imageCount += safeImageAdd(img.src);
/*							LocalImages.insert({
								url: img.src
							});
							console.log('Added URL:', img.src);*/
						}
					} else if (tag.tagName === "A") {
						var href = tag.href;
						if (urlList.indexOf(href) > -1) return null;
						else urlList.push(href);
						if (imageCount < MAX_IMAGES &&
							href.indexOf('jpg') > -1 &&
							!LocalImages.findOne({
								url: href
							}) &&
							!Images.findOne({
								url: href,
								pastec: pastec,
								host: host
							})) {
							imageCount += safeImageAdd(href);
/*							LocalImages.insert({
								url: href
							});
							console.log('Added HRef:', href); */
						} else if (urlParse.parse(href).hostname === urlHost && timeNow < maxTimeout && imageCount < MAX_IMAGES) c.queue(href);
					}
				}));
				result.window.close();
			}, function(e) {
				console.log("BIND ERROR", e);
			}),
			skipDuplicates: true,
			autoWindowClose: false,
			retries: 0,			
			onDrain: Meteor.bindEnvironment(function() {
				if (timeout) Meteor.clearTimeout(timeout);
				if (new Date() < minTimeout) {
					timeout = Meteor.setTimeout(function() {
						console.log("returning results after timeout");
						fut.return(true);
					}, MIN_TIMEOUT);
				}
				else {
					console.log("returning results directly");
					fut.return(true);					
				}
			})
		});
		console.log(urlHost);
		c.queue({
			uri: url,
			timeout: TIMEOUT
		});
		return fut.wait();
	},

	'app/get_crawler': function() {
		return JSON.stringify(global.c);
	},

	'app/remove_local_images': function() {
		LocalImages.remove({});
		return true;
	}
});

