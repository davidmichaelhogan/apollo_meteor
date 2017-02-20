import { Mongo } from 'meteor/mongo';

export const Ads = new Mongo.Collection('ads');

if (Meteor.isServer) {
  // This code only runs on the server
  Meteor.publish('categories', () => {
    return Categories.find();
  });
}
