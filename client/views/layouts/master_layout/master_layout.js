/*****************************************************************************/
/* MasterLayout: Event Handlers and Helpers */
/*****************************************************************************/
Template.MasterLayout.events({
  /*
   * Example:
   *  'click .selector': function (e, tmpl) {
   *
   *  }
   */
  'mouseover #popOut': function(event) {
    $.UIkit.offcanvas.offcanvas.show('#sidebar');
  },
  'mouseleave .uk-offcanvas-bar-show': function(event) {
    $.UIkit.offcanvas.offcanvas.hide();
  }
});

Template.MasterLayout.helpers({
  /*
   * Example:
   *  items: function () {
   *    return Items.find();
   *  }
   */
});

/*****************************************************************************/
/* MasterLayout: Lifecycle Hooks */
/*****************************************************************************/
Template.MasterLayout.created = function() {};

Template.MasterLayout.rendered = function() {};

Template.MasterLayout.destroyed = function() {};