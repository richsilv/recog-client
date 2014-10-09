/*****************************************************************************/
/* PostImage Methods */
/*****************************************************************************/

var Future = Meteor.npmRequire('fibers/future'),
	http = Meteor.npmRequire('http');
	pastec = Control.findOne({key: 'pastec'});

Meteor.methods({
 /*
  * Example:
  *  '/app/post_image/update/email': function (email) {
  *    Users.update({_id: this.userId}, {$set: {'profile.email': email}});
  *  }
  *
  */
  '/app/post_image': function(image) {
  	var fut = new Future();
  	if (!pastec || !pastec.connection) return new Meteor.Error(500, 'Not connected to Pastec server');

  	var req = http.get(image.url, Meteor.bindEnvironment(function(res) {
	    var buf = new Buffer("", "binary");
	    res.on('data', Meteor.bindEnvironment(function(chunk) {
	        buf = Buffer.concat([buf, chunk]);
	    }));
	    res.on('end', Meteor.bindEnvironment(function() {
	    	if (res.statusCode === 200 && buf.length) {
				HTTP.put(pastec.url + '/index/images/' + image.index.toString(), {content: buf}, function(err, res) {
	  				if (err || !res) {
	  					fut.throw(err);
	  					throw err;
	  				}
	  				else {
	  					var responseObject = JSON.parse(res.content);
				        if (responseObject.type === 'IMAGE_ADDED') Images.insert(image);
	  					fut.return(responseObject);
	  				}
	  			});	    		
	    	}
	  	}));
	}));
  	this.unblock();
  	return fut.wait();
  }
});
