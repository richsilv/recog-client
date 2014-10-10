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
    return (!controller.routeDict.get('ready') || !LocalImages.find({width: {$exists: true}}).count()) && controller.params.url;
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
          artist: template.$('.image-artist').val(),
          width: this.width,
          height: this.height
        };
    Meteor.call('/app/post_image', imageDoc, function(err, res) {
      if (!err && res) {
        var notification = {
          pos: 'top-right',
          timeout: 3000,
          message: 'Unknown response.',
          status: 'info'
        };
        switch(res.type) {
          case "IMAGE_ADDED":
            _.extend(notification, {message: imageDoc.title + ' by ' + imageDoc.artist + ' successfully added.', status: 'success'});
            break;
          case "IMAGE_SIZE_TOO_BIG":
            _.extend(notification, {message: 'That image is too small to add!', status: 'error'});
            break;
          case "IMAGE_SIZE_TOO_SMALL":
            _.extend(notification, {message: 'That image is too large to add!', status: 'error'});
            break;
        }
        $.UIkit.notify(notification);
        template.$('li').velocity(
          "slideUp", {
            duration: 1500,
            delay: 500, 
            complete: function() {
              LocalImages.remove({_id: this._id});
              $(template.firstNode).next().find('.image-title').focus();
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
