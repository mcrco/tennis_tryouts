import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';

Meteor.methods({
    async createUserAccount(options) {
        await Accounts.createUserVerifyingEmail(options);
    },
    sendVerificationLinkEmail(email: string) {
        const user = Accounts.findUserByEmail(email);
        Accounts.sendVerificationEmail(user!._id)
    }
});
