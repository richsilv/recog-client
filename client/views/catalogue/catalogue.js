/*****************************************************************************/
/* Catalogue: Event Handlers and Helpers */
/*****************************************************************************/
Template.Catalogue.events({
  /*
   * Example: 
   *  'click .selector': function (e, tmpl) {
   *
   *  }
   */
});

Template.Catalogue.helpers({
  /*
   * Example: 
   *  items: function () {
   *    return Items.find();
   *  }
   */
});

Template.imagePanel.events({
  'click .uk-close': function() {
    Images.remove({_id: this._id});
  }
})

/*****************************************************************************/
/* Catalogue: Lifecycle Hooks */
/*****************************************************************************/
Template.Catalogue.created = function () {
};

Template.Catalogue.rendered = function () {
};

Template.Catalogue.destroyed = function () {
};
