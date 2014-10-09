/*****************************************************************************/
/* Home: Event Handlers and Helpers */
/*****************************************************************************/
Template.Home.events({
  /*
   * Example: 
   *  'click .selector': function (e, tmpl) {
   *
   *  }
   */
});

Template.Home.helpers({
  /*
   * Example: 
   *  items: function () {
   *    return Items.find();
   *  }
   */
   notReady: function() {
    var controller = Router.current();
    return !controller.routeDict.get('ready');
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
    rootUrl = $('input').val();
    Router.go('/?url=' + encodeURI(rootUrl));
    return false;
  }
});


Template.imageItem.events({
  'load': function(event, template) {
    template.$('span.dimensions').html(event.target.naturalWidth + ' x ' + event.target.naturalHeight);
  },

  'click button': function(event, template) {
    var controller = Router.current(),
        imageDoc = {
          url: this.valueOf(),
          index: Images.nextIndex(),
          title: template.$('.image-title').val(),
          artist: template.$('image-artist').val()
        };
    Meteor.call('/app/postImage', imageDoc, function(err, res) {
      if (!err && res && res.data.type === "IMAGE_ADDED") {
        template.$('li').velocity(
          "slideUp", {
            duration: 1500,
            delay: 500, 
            complete: function() {
              controller.routeDict.set('data', _.without(controller.routeDict.get('data'), imageDoc.url));
            }
        });
      }
    });
  }
})

/*****************************************************************************/
/* Home: Lifecycle Hooks */
/*****************************************************************************/
Template.Home.created = function () {
};

Template.Home.rendered = function () {
};

Template.Home.destroyed = function () {
};

Template.imageItem.rendered = function() {
  var image = this.find('img');

}
