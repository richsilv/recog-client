/*****************************************************************************/
/* Catalogue: Event Handlers and Helpers */
/*****************************************************************************/
currentImage = new ReactiveVar();

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
  'click .image': function(event, template) {
    _this = this;
    currentImage.set(_this);
    $.UIkit.modal('#image-modal').show();
    $('#image-modal').on({
      'uk.modal.hide': function() {
        var details = {
              title: $('#image-title').val(),
              artist: $('#image-artist').val()
            };
        Images.update({_id: _this._id}, {$set: details});        
      }
    });
  }
});

Template.imageModal.helpers({
  image: function() {
    return currentImage.get();
  }
});

Template.imageModal.events({
  'keyup': function(event, template) {
    if (event.keyCode === 13) $.UIkit.modal('#image-modal').hide();
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
