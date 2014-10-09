/*
 * Add query methods like this:
 *  Pastec.findPublic = function () {
 *    return Pastec.find({is_public: true});
 *  }
 */

Pastec.allow({
  insert: function (userId, doc) {
    return true;
  },

  update: function (userId, doc, fieldNames, modifier) {
    return true;
  },

  remove: function (userId, doc) {
    return true;
  }
});

Pastec.deny({
  insert: function (userId, doc) {
    return false;
  },

  update: function (userId, doc, fieldNames, modifier) {
    return false;
  },

  remove: function (userId, doc) {
    return false;
  }
});

Meteor.startup(function() {
  Meteor.setInterval(function() {
    Pastec.find().forEach(function (pastec) {
      pastec && HTTP.post(pastec.serverUrl, {
        data: {
          type: "PING"
        }
      }, function(err, res) {
        if (!err && res.statusCode === 200) {
          var content = JSON.parse(res.content);
          if (content && content.type === "PONG") {
            Pastec.update(pastec, {
              $set: {
                connection: true
              }
            });
          } else {
            Pastec.update(pastec, {
              $set: {
                connection: false
              }
            });
          }
        } else {
          Pastec.update(pastec, {
            $set: {
              connection: false
            }
          });
        }
      });
    });
  }, 5000);
});