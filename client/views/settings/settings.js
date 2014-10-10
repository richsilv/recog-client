/*****************************************************************************/
/* Settings: Event Handlers and Helpers */
/*****************************************************************************/
errorState = new ReactiveVar({});

Template.Settings.events({
    /*
     * Example:
     *  'click .selector': function (e, tmpl) {
     *
     *  }
     */
    'click button, click .uk-placeholder': function() {
        $.UIkit.modal('#add-modal').show();
    }
});

Template.Settings.helpers({
    /*
     * Example:
     *  items: function () {
     *    return Items.find();
     *  }
     */
    errorState: function() {
        return errorState.get();
    }
});

Template.pastec_details.events({
  'click': function (event) {
    if (!$(event.currentTarget).hasClass('uk-close')) {
      Pastec.update({_id: this._id}, {$set: {current: true}});
    }
  },
  'click .uk-close': function() {
    Pastec.remove({_id: this._id});
  }
});

Template.modal_contents.events({
    'click button': function(event, template) {
        var url = template.$('input[type="url"]').val(),
            description = template.$('input[type="text"]').val(),
            currentState = errorState.get();
        currentState.urlErr = !url;
        currentState.descriptionErr = !description;
        errorState.set(currentState);
        if (url && description) {
            Pastec.insert({
                serverUrl: url,
                description: description
            });
            $.UIkit.modal('#add-modal').hide();
            template.$('input[type="url"]').val('');
            description = template.$('input[type="text"]').val('');
        }
    }
});

/*****************************************************************************/
/* Settings: Lifecycle Hooks */
/*****************************************************************************/
Template.Settings.created = function() {};

Template.Settings.rendered = function() {};

Template.Settings.destroyed = function() {};