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

Pastec.before.update(function(userId, doc, fieldNames, modifier) {
	modSet = modifier['$set'] || {};
	if (modSet.current === true) Pastec.update({
		_id: {$ne: doc._id},
		current: true
	}, {
		$set: {current: false}
	});
});

Pastec.before.insert(function(userId, doc) {
	Pastec.update({
		current: true
	}, {
		$set: {current: false}
	})
	doc.current = true;
});

Pastec.before.remove(function(userId, doc) {
	if (doc.current === true) {
		newCurrent = Pastec.findOne({
			_id: {$ne: doc._id}
		});
		newCurrent && Pastec.update(newCurrent, {
			$set: {current: true}
		});
	}
});