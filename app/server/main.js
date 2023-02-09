import { Meteor } from 'meteor/meteor';
import { records } from '/imports/api/records';

const insertRecord = record => records.insert(record);

Meteor.startup(() => {
});