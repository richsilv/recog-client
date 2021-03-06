UploadController = RouteController.extend({
	routeDict: new ReactiveDict(),

	waitOn: function() {},

	data: function() {
		return {
			tags: LocalImages.find(),
			url: this.params.query.url
		};
	},

	onBeforeAction: function() {
		var _this = this,
			pastec = Pastec._id(),
			host = Control._id();
		_this.routeDict.set('ready', true);
		if (_this.params.query.url) {
			_this.routeDict.set('ready', false);
			_this.routeDict.set('url', _this.params.query.url);
			Meteor.call('/app/get_u_r_l', decodeURI(_this.params.query.url), function(err, res) {
				_this.routeDict.set('ready', true);
				if (!err) {
					_.each(res, function(thisUrl) {
						if (!Images.find({
							url: thisUrl,
							host: host,
							pastec: pastec
						}).count() && !LocalImages.find({
							url: thisUrl
						}).count()) LocalImages.insert({
							url: thisUrl
						});
					});
				} else throw err;
			});
		} else if (_this.routeDict.get('url')) {
			_this.redirect('/?url=' + _this.routeDict.get('url'));
		} else {
			_this.routeDict.set('data', []);
		}
		this.next();
	}

});