/*****************************************************************************/
/* TestImage Methods */
/*****************************************************************************/
var Future = Meteor.npmRequire('fibers/future'),
    http = Meteor.npmRequire('http');

Meteor.methods({
 /*
  * Example:
  *  '/app/test_image/update/email': function (email) {
  *    Users.update({_id: this.userId}, {$set: {'profile.email': email}});
  *  }
  *
  */
  '/app/test_image': function(url) {
        var pastec = Pastec.current();
        console.log("Attempting to test image (" + url + ")...");
        var fut = new Future();
        if (!pastec || !pastec.connection) return new Meteor.Error(500, 'Not connected to Pastec server');

        console.log("Requesting image from " + url);
        var req = http.get(url, Meteor.bindEnvironment(function(res) {
            var buf = new Buffer("", "binary");
            res.on('data', Meteor.bindEnvironment(function(chunk) {
                buf = Buffer.concat([buf, chunk]);
            }));
            res.on('end', Meteor.bindEnvironment(function() {
                console.log("Posting image data to Pastec");
                if (res.statusCode === 200 && buf.length) {
                    HTTP.post(pastec.serverUrl + '/index/searcher', {
                        content: buf
                    }, function(err, res) {
                        if (err || !res) {
                            console.log("Image posting problem!");
                            fut.throw(err);
                            throw err;
                        } else {
                            console.log("Image testing completed with result", res.content);
                            var responseObject = JSON.parse(res.content);
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