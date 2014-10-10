/*****************************************************************************/
/* Catalogue: Event Handlers and Helpers */
/*****************************************************************************/
var currentImage = new ReactiveVar();

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
  },
  'click .image': function() {
    currentImage.set(this.url);
    console.log(this.url);
    $.UIkit.modal('#image-modal').show();
  }
});

Template.imageModal.helpers({
  image: function() {
    return currentImage.get();
  }
});

/*****************************************************************************/
/* Catalogue: Lifecycle Hooks */
/*****************************************************************************/
Template.Catalogue.created = function () {
};

Template.Catalogue.rendered = function () {
};

Template.Catalogue.destroyed = function () {
};
