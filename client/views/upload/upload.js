/*****************************************************************************/
/* Home: Event Handlers and Helpers */
/*****************************************************************************/
Template.Upload.events({
  /*
   * Example: 
   *  'click .selector': function (e, tmpl) {
   *
   *  }
   */
});

Template.Upload.helpers({
  /*
   * Example: 
   *  items: function () {
   *    return Items.find();
   *  }
   */
   notReady: function() {
    var controller = Router.current();
    return !controller.routeDict.get('ready') || !LocalImages.find({width: {$exists: true}}).count();
   }
});

Template.sourceEntry.helpers({
  helper: function () {
    console.log("context", Template.parentData(0));
    console.log("parent context", Template.parentData(1));
  }
});

Template.sourceEntry.events({
  'submit .uk-form': function() {
    LocalImages.remove({});
    rootUrl = $('input').val();
    Router.go('/?url=' + encodeURI(rootUrl));
    return false;
  }
});

Template.results.helpers({
  tags: function() {
    return LocalImages.find();
  }
});

Template.imageItem.events({
  'load': function(event, template) {
    if (event.target.naturalWidth >= 150 && event.target.naturalHeight >= 150) {
      LocalImages.update({_id: this._id}, {$set: {width: event.target.naturalWidth, height: event.target.naturalHeight}});
    } else {
      LocalImages.remove({_id: this._id});
    }
  },

  'click button, keyup .image-artist, keyup .image-title': function(event, template) {
    if (event.type === 'keyup'  && !(event.keyCode === 13)) return false;
    var controller = Router.current(),
        imageDoc = {
          url: this.url,
          index: Images.nextIndex(),
          title: template.$('.image-title').val(),
          artist: template.$('.image-artist').val()
        };
    Meteor.call('/app/post_image', imageDoc, function(err, res) {
      if (!err && res) {
        switch(res.type) {
          case "IMAGE_ADDED":
            toastr.success('Image Added!', imageDoc.title + ' by ' + imageDoc.artist + ' successfully added.')
            break;
          case "IMAGE_SIZE_TOO_BIG":
            toastr.error('Image Too Small!.', 'Sorry, that image is too small to add.')
            break;
          case "IMAGE_SIZE_TOO_SMALL":
            toastr.error('Image Too Large!.', 'Sorry, that image is too large to add.')
            break;
        }
        template.$('li').velocity(
          "slideUp", {
            duration: 1500,
            delay: 500, 
            complete: function() {
              controller.routeDict.set('data', _.without(controller.routeDict.get('data'), imageDoc.url));
            }
        });
      }
      else console.log(err);
    });
  }
})

/*****************************************************************************/
/* Home: Lifecycle Hooks */
/*****************************************************************************/

Template.imageItem.rendered = function() {
  var image = this.find('img');

}
