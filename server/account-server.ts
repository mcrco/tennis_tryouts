import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';

Accounts.config({
    sendVerificationEmail: true,
})

Meteor.methods({
    async createUserAccount(options, callback) {
        let res = await Accounts.createUserVerifyingEmail(options);
        callback(res);
    },
    sendVerificationEmail(email: string) {
        const user = Accounts.findUserByEmail(email);
        Accounts.sendVerificationEmail(user!._id);
    },
    sendPasswordResetEmail(email) {
        const user = Accounts.findUserByEmail(email);
        Accounts.sendResetPasswordEmail(user!._id);
    }
});
