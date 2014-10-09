CatalogueController = RouteController.extend({
  waitOn: function () {
  },

  data: function () {
  	return {
  		images: Images.find()
  	}
  },

  action: function () {
    this.render();
  }
});
