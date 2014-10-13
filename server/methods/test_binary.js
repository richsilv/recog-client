/*****************************************************************************/
/* TestBinary Methods */
/*****************************************************************************/
var Future = Meteor.npmRequire('fibers/future'),
    request = Meteor.npmRequire('request'),
    atob = Meteor.npmRequire('atob');

Meteor.methods({
  '/app/test_binary': function(b64e) {
        var pastec = Pastec.current();
        console.log("Attempting to test binary data...");
        var fut = new Future();
        if (!pastec || !pastec.connection) return new Meteor.Error(500, 'Not connected to Pastec server');
        console.log("Posting image data to Pastec");
        var buf = new Buffer(atob(b64e), "binary")
        if (buf.length) {
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
        else fut.return({});
        this.unblock();
        return fut.wait();
    }
});