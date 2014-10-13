/*****************************************************************************/
/* Client App Namespace  */
/*****************************************************************************/
_.extend(App, {});

App.helpers = {
	pastec: function() {
		return Pastec.findOne({
			current: true
		});
	},

	not: function(bool) {
		return !bool;
	}
};

_.each(App.helpers, function(helper, key) {
	Handlebars.registerHelper(key, helper);
});

UI.body.rendered = function() {
	$('body').hammer({
/*		touchAction: 'pan-y',
		domEvents: true	*/
	});
};