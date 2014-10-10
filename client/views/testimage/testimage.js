/*****************************************************************************/
/* Testimage: Event Handlers and Helpersss .js*/
/*****************************************************************************/
var currentImage = new ReactiveVar();

Template.Testimage.events({
    /*
     * Example:
     *  'click .selector': function (e, tmpl) {
     *
     *  }
     */
    'click button, keyup input': function(event, template) {
        var url = template.$('input').val();
        if ((event.keyCode && event.keyCode !== 13) || !url) return false;
        Meteor.call('/app/test_image', url, function(err, res) {
            if (err) $.UIkit.notify({
                message: err.toString(),
                timeout: 300,
                pos: 'top-right',
                status: 'danger'
            });
            else if (res.type !== "SEARCH_RESULTS") $.UIkit.notify({
                message: res.type,
                timeout: 300,
                pos: 'top-right',
                status: 'warning'
            });
            else if (res.image_ids && res.image_ids.length) {
                var image = Images.findOne({
                    index: res.image_ids[0]
                });
                currentImage.set(image);
                $.UIkit.modal('#test-modal').show();
            } else UIkit.notify({
                message: "No results returned",
                timeout: 300,
                pos: 'top-right',
                status: 'warning'
            });
        });
    }
});

Template.Testimage.helpers({
    /*
     * Example:
     *  items: function () {
     *    return Items.find();
     *  }
     */
    currentImage: function() {
      return currentImage.get();
    }
});

/*****************************************************************************/
/* Testimage: Lifecycle Hooks */
/*****************************************************************************/
Template.Testimage.created = function() {};

Template.Testimage.rendered = function() {};

Template.Testimage.destroyed = function() {};