/*
 * Add query methods like this:
 *  Control.findPublic = function () {
 *    return Control.find({is_public: true});
 *  }
 */

Control.allow({
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
  if (!Control.findOne({key: "dbIdentity"})) Control.insert({key: "dbIdentity"});
});