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
    return (!controller.state || !controller.state.get('ready') || !LocalImages.find({width: {$exists: true}}).count()) && controller.params.query.url;
   }
});

Template.sourceEntry.helpers({
  helper: function () {
    console.log("context", Template.parentData(0));
    console.log("parent context", Template.parentData(1));
  }
});

Template.sourceEntry.events({
  'submit .uk-form': function(event) {
    event.preventDefault();
    Meteor.call('app/remove_local_images');
    var rootUrl = $('input').val(),
        routeController = Router.current();
    routeController.state.set('ready', false);
    console.log(rootUrl);
    Meteor.call('/app/get_u_r_l', rootUrl, function(err, res) {
      routeController.state.set('ready', true);
    });
  }
});

Template.results.helpers({
  tags: function() {
    return LocalImages.find({}, {limit: 50});
  }
});

Template.imageItem.events({
  'load': function(event, template) {
    if ((event.target.naturalWidth >= 200 && event.target.naturalHeight >= 200) || LocalImages.find().count() === 1) {
      LocalImages.update({_id: this._id}, {$set: {width: event.target.naturalWidth, height: event.target.naturalHeight}});
    } else {
      LocalImages.remove({_id: this._id});
    }
  },

  'click [data-action="remove"]': function() {
    LocalImages.remove({_id: this._id});
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
          height: this.height,
          pastec: Pastec._id(),
          host: Control._id()
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
              LocalImages.remove({url: this.url});
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
