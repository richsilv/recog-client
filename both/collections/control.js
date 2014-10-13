Control = new Meteor.Collection('control');

/*
 * Add query methods like this:
 *  Control.findPublic = function () {
 *    return Control.find({is_public: true});
 *  }
 */

Control._id = function() {
	var dbIdentity = Control.findOne({key: 'dbIdentity'});
	return dbIdentity && dbIdentity._id;
}