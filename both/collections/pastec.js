Pastec = new Meteor.Collection('pastec');

/*
 * Add query methods like this:
 *  Pastec.findPublic = function () {
 *    return Pastec.find({is_public: true});
 *  }
 */

Pastec.current = function() {
	return Pastec.find({current: true});
};
