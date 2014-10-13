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
    $.UIkit.offcanvas.show('#sidebar');
  },
  'mouseleave .uk-offcanvas-bar-show': function(event) {
    $.UIkit.offcanvas.hide();
  },
  'click [data-item-type="link"]': function() {
    $.UIkit.offcanvas.hide();
  },
  'swipeRight': function(e) {
    $.UIkit.offcanvas.show('#sidebar');
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