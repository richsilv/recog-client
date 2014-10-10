SettingsController = RouteController.extend({
  waitOn: function () {
  },

  data: function () {
  	return {
  		pastecServers: Pastec.find()
  	}
  },

  action: function () {
    this.render();
  }
});
