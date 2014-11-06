UploadController = RouteController.extend({

	waitOn: function() {},

	data: function() {
		return {
			tags: LocalImages.find(),
			url: this.params.url
		};
	},
/*
	onBeforeAction: function() {
		var _this = this,
			pastec = Pastec._id(),
			host = Control._id();
		_this.state.set('ready', true);
		if (_this.params.query.url) {
			_this.state.set('ready', false);
			_this.state.set('url', _this.params.query.url);
			Meteor.call('/app/get_u_r_l', decodeURI(_this.params.query.url), function(err, res) {
				_this.state.set('ready', true);
			});
		} else if (_this.state.get('url')) {
			_this.redirect('/?url=' + _this.state.get('url'));
		} else {
			_this.state.set('data', []);
		}
		this.next();
	}*/

});