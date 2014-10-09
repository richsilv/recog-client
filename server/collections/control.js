/*
 * Add query methods like this:
 *  Control.findPublic = function () {
 *    return Control.find({is_public: true});
 *  }
 */

Control.allow({
  insert: function(userId, doc) {
    return true;
  },

  update: function(userId, doc, fieldNames, modifier) {
    return true;
  },

  remove: function(userId, doc) {
    return true;
  }
});

Control.deny({
  insert: function(userId, doc) {
    return false;
  },

  update: function(userId, doc, fieldNames, modifier) {
    return false;
  },

  remove: function(userId, doc) {
    return false;
  }
});

Meteor.startup(function() {
  Meteor.setInterval(function() {
    var pastec = Control.findOne({
      key: 'pastec'
    });
    pastec && HTTP.post(pastec.serverUrl, {
      data: {
        type: "PING"
      }
    }, function(err, res) {
      if (!err && res.statusCode === 200) {
        var content = JSON.parse(res.content);
        if (content && content.type === "PONG") {
          Control.update({
            key: 'pastec'
          }, {
            $set: {
              connection: true
            }
          });
        } else {
          Control.update({
            key: 'pastec'
          }, {
            $set: {
              connection: false
            }
          });
        }
      } else {
        Control.update({
          key: 'pastec'
        }, {
          $set: {
            connection: false
          }
        });
      }
    });
  }, 5000);
});