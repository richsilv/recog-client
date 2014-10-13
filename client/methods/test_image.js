/*****************************************************************************/
/* TestImage Methods */
/*****************************************************************************/

Meteor.methods({
 /*
  * Example:
  *  '/app/test_image/update/email': function (email) {
  *    Users.update({_id: this.userId}, {$set: {'profile.email': email}});
  *  }
  *
  */
  '/app/test_image': function() {
  	$('[data-button-type="test-link"]').addClass('testing');
  }
});