// core
import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check, Match } from 'meteor/check';
import { Roles } from 'meteor/alanning:roles';
import { _err, _log } from 'meteor/nihiven:projekt';

// collections
import { Profiles } from './profiles.js';

// imports from npm package
import SimpleSchema from 'simpl-schema';
import moment from 'moment';

// exports
export const Comments = new Mongo.Collection('comments');
export { Comments as default };

if (Meteor.isServer) {
  Meteor.publish('comments.public', function(projectId) {
    check(projectId, String);
    return Comments.find({ projectId });
  });
}

// Deny all client-side updates
Comments.deny({
  insert() { return true; },
  update() { return true; },
  remove() { return true; },
});

// schema config
Comments.schema = new SimpleSchema({
  userId: {
    type: String,
    optional: false,
    label() { return 'The user id of the commenter.'; },
  },
  projectId: {
    type: String,
    optional: false,
    label() { return 'The project id the comment belongs to.'; },
  },
  parentId: {
    type: String,
    optional: false,
    label() { return 'The project id the comment belongs to.'; },
  },
  comment: {
    type: String,
    optional: false,
    label() { return 'The comment.'; },
  },
  createdTime: {
    type: Date,
    optional: false,
    label() { return 'Time the task was created.'; },
  },
  isRemoved: {
    type: Boolean,
    optional: false,
    label() { return 'Removal status of the comment.';},
  },
});
Comments.attachSchema(Comments.schema);

Comments.helpers({
  profile() {
    return Profiles.findOne({ userId: this.userId });
  },
  aLongLongTimeAgo() {
    if (this.createdTime !== undefined) {
      return moment(this.createdTime).fromNow();
    } else {
      return '';
    }
  },
  replies() {
    // return comments that list this item as the parentId
    return Comments.find({ parentId: this._id }, { sort: { createdTime: -1 }});
  },
  hasReplies() {
    const count = Comments.find({ parentId: this._id }).count();
    return (count === 0 ? false : true);
  },
});

Meteor.methods({
  'comments.new'(projectId, parentId, comment) {
    check(projectId, String);
    check(parentId, String);
    check(comment, String);

    // user must be logged in
    if (!this.userId) {
      _err('notAuthorized');
    }

    const result = Comments.insert({
      projectId,
      parentId,
      userId: this.userId,
      comment,
      createdTime: Date.now(),
      isRemoved: false,
    });

    return result;
  },
  'comments.remove'(commentId) {
    check(commentId, String);

    const commentOwnerId = Comments.findOne({ _id: commentId }).userId;
    if (commentOwnerId !== this.userId && Roles.adminCheckFails(this.userId)) {
      _err('cantRemoveComment');
      return false;
    }

    return Comments.update({ _id: commentId }, { $set: { comment: '[removed]', isRemoved: true }});
  },
  'comments.delete'(commentId) {
    // TODO: delete children too?
    check(commentId, String);

    if (Roles.adminCheckFails(this.userId)) {
      _err('cantRemoveCommentAdmin');
      return false;
    }

    return Comments.remove({ _id: commentId });
  },
});
