import { Meteor } from 'meteor/meteor';
import { MatchCollection } from '/imports/api/collections.js'
import { SessionCollection } from '../imports/api/collections';
import { PlayerCollection } from '../imports/api/collections';

Meteor.startup(() => {
    const SEED_USERNAME = 'admin'
    const SEED_PASSWORD = 'password'

    if (!Accounts.findUserByUsername(SEED_USERNAME)) {
        Accounts.createUser({
            username: SEED_USERNAME,
            password: SEED_PASSWORD,
        });
    }
});
