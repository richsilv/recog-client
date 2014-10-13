CatalogueController = RouteController.extend({
  waitOn: function() {},

  data: function() {
    return {
      images: Images.find({
        pastec: Pastec._id(),
        host: Control._id()
      }, {
        sort: {index: 1}
      })
    }
  },

  action: function() {
    this.render();
  }
});