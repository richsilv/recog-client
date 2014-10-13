/*****************************************************************************/
/* PostImage Methods */
/*****************************************************************************/

var Future = Meteor.npmRequire('fibers/future'),
    request = Meteor.npmRequire('request');

Meteor.methods({
    /*
     * Example:
     *  '/app/post_image/update/email': function (email) {
     *    Users.update({_id: this.userId}, {$set: {'profile.email': email}});
     *  }
     *
     */
    '/app/post_image': function(image) {
        var pastec = Pastec.current();
        console.log("Attempting to add image (" + image.title + " by " + image.artist + ")...");
        var fut = new Future();
        if (!pastec || !pastec.connection) return new Meteor.Error(500, 'Not connected to Pastec server');

        console.log("Requesting image from " + image.url);
        var buf = new Buffer("", "binary"),
            req = request.get(image.url, Meteor.bindEnvironment(function(res) {}))
            .on('data', Meteor.bindEnvironment(function(chunk) {
                buf = Buffer.concat([buf, chunk]);
            }))
            .on('end', Meteor.bindEnvironment(function() {
                console.log("Posting image data to Pastec");
                if (buf.length) {
                    HTTP.put(pastec.serverUrl + '/index/images/' + image.index.toString(), {
                        content: buf
                    }, function(err, res) {
                        if (err || !res) {
                            console.log("Image posting problem!");
                            fut.throw(err);
                            throw err;
                        } else {
                            HTTP.post(pastec.serverUrl + '/index/io', {
                                data: {
                                    "type": "WRITE",
                                    "index_path": "index.dat"
                                }
                            }, function(err, res) {
                                console.log(err, res);
                            });
                            console.log("Image posting completed with result", res.content);
                            var responseObject = JSON.parse(res.content);
                            if (responseObject.type === 'IMAGE_ADDED') Images.insert(image);
                            fut.return(responseObject);
                        }
                    });
                }
                else fut.return({});
            }));
        this.unblock();
        return fut.wait();
    }
});