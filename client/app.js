/*****************************************************************************/
/* Client App Namespace  */
/*****************************************************************************/
_.extend(App, {
});

App.helpers = {
  pastec: function() {
    return Control.findOne({key: 'pastec'});
  },

  not: function(bool) {
  	return !bool;
  }
};

_.each(App.helpers, function (helper, key) {
  Handlebars.registerHelper(key, helper);
});
