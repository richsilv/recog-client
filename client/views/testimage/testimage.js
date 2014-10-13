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
    'click [data-button-type="list-icon"]': function(event, template) {
        var icon = $(event.currentTarget);
        if (!icon.hasClass('uk-disabled')) template.linkName.set(icon.data('linkName'));
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
    },

    activeLink: function(name) {
        var _this = Template.instance();
        return _this && (name === _this.linkName.get());
    },

    disabledLink: function(name) {
        var _this = Template.instance();
        return !_this.enabledSources.get()[name];
    }
});

Template.urlTest.events({
    'click [data-button-type="test-link"], keyup input': function(event, template) {
        var url = template.$('input').val();
        if ((event.keyCode && event.keyCode !== 13) || !url) return false;
        console.log(url);
        Meteor.call('/app/test_image', url, displayResults);
    }
});

Template.cameraTest.events({
    'click [data-button-type="camera"]': function() {
        pictureSource = navigator.camera.PictureSourceType;
        destinationType = navigator.camera.DestinationType;
        navigator.camera.getPicture(
            function(data) {
                Meteor.call('/app/test_binary', data, displayResults);
            }, function(err) {
                $.UIkit.notify({
                    message: "Camera Problem!<br>" + err,
                    timeout: 3000,
                    pos: 'top-right',
                    status: 'danger'
                });
            }, {
                quality: 50,
                destinationType: destinationType.DATA_URL
            });
    }
})

/*****************************************************************************/
/* Testimage: Lifecycle Hooks */
/*****************************************************************************/
Template.Testimage.created = function() {
    this.linkName = new ReactiveVar('url');
    this.enabledSources = new ReactiveVar(getEnabledSources());
};

Template.Testimage.rendered = function() {};

Template.Testimage.destroyed = function() {};

function getEnabledSources() {;
    return {
        url: true,
        file: !Meteor.isCordova,
        camera: true //!!navigator.camera
    }
}

function displayResults(err, res) {
    $('.testing').removeClass('testing');
    if (err) $.UIkit.notify({
        message: err.toString(),
        timeout: 3000,
        pos: 'top-right',
        status: 'danger'
    });
    else if (res.type !== "SEARCH_RESULTS") $.UIkit.notify({
        message: res.type,
        timeout: 3000,
        pos: 'top-right',
        status: 'warning'
    });
    else if (res.image_ids && res.image_ids.length) {
        var image = Images.findOne({
            index: res.image_ids[0]
        });
        if (image) {
            currentImage.set(image);
            $.UIkit.modal('#test-modal').show();
        }
        else {
            $.UIkit.notify({
                message: "Image recognised, but not present in local database",
                timeout: 3000,
                pos: 'top-right',
                status: 'warning'
            });
        }
    } else $.UIkit.notify({
        message: "No results returned",
        timeout: 3000,
        pos: 'top-right',
        status: 'warning'
    });
}