Pastec = new Meteor.Collection('pastec');

/*
 * Add query methods like this:
 *  Pastec.findPublic = function () {
 *    return Pastec.find({is_public: true});
 *  }
 */

Pastec.current = function() {
	return Pastec.findOne({current: true});
};

Pastec._id = function() {
	var pastec = Pastec.findOne({current: true});
	return pastec && pastec._id;
};
