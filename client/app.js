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
	});
};

Messages.find().observe({
	added: function (document) {
        $.UIkit.notify({
            message: document.content,
            timeout: document.timeout || 3000,
            pos: 'top-right',
            status: document.status || 'info'
        });
		Messages.remove({_id: document._id});
	}
});