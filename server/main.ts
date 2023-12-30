import { Meteor } from 'meteor/meteor';
import '/imports/api/collections'
import './account-server';
import './collections-server';

Meteor.startup(() => {
    process.env.MAIL_URL = Meteor.settings.email.mail_url;
});
