Images = new Meteor.Collection('images');

/*
 * Add query methods like this:
 *  Images.findPublic = function () {
 *    return Images.find({is_public: true});
 *  }
 */

Images.nextIndex = function() {
	var lastImage = Images.find({}, {sort: {index: -1}, limit: 1}).fetch();
	return lastImage.length ? lastImage[0].index + 1 : 1;
}