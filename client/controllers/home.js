HomeController = RouteController.extend({
	routeDict: new ReactiveDict(),

	waitOn: function() {},

	data: function() {
		return {
			tags: this.routeDict.get('data'),
			url: this.params.url
		};
	},

	onBeforeAction: function() {
		var _this = this;
		_this.routeDict.set('ready', true);
		if (_this.params.url) {
			_this.routeDict.set('ready', false);
			Meteor.call('/app/get_u_r_l', decodeURI(_this.params.url), function(err, res) {
				_this.routeDict.set('ready', true);
				if (!err) {
					_.each(res, function(thisUrl) {
						if (!Images.find({url: thisUrl}).count()) LocalImages.insert({url: thisUrl});
					});
				}	
				else throw err;
			});
		} else {
			_this.routeDict.set('data', []);
		}
	}

});