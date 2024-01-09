import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';

Accounts.config({
    sendVerificationEmail: true,
});

Accounts.emailTemplates.from = 'Tennis Ranker <support@tennisranker.us>';
Accounts.emailTemplates.verifyEmail = {
    subject() {
        return "[Tennis Ranker] Verify Your Email Address";
    },
    text(user, url) {
        let emailAddress = user.emails![0].address,
            urlWithoutHash = url.replace('#/', ''),
            supportEmail = "marco.yang.ca@gmail.com",
            emailBody = `To verify your email address (${emailAddress}) visit the following link:\n\n${urlWithoutHash}\n\n If you did not request this verification, please ignore this email. If you feel something is wrong, please contact the developer: ${supportEmail}.`;

        return emailBody;
    }
};
Accounts.emailTemplates.resetPassword = {
    subject() {
        return "[Tennis Ranker] Reset Your Password";
    },
    text(user, url) {
        let urlWithoutHash = url.replace('#/', ''),
            supportEmail = "marco.yang.ca@gmail.com",
            emailBody = `To reset your password, visit the following link:\n\n${urlWithoutHash}\n\n If you did not request this verification, please ignore this email. If you feel something is wrong, please contact the developer: ${supportEmail}.`;

        return emailBody;
    }
};

Meteor.methods({
    async createUserAccount(options) {
        try {
            return await Accounts.createUserVerifyingEmail(options);
        } catch (err) {
            return err;
        }
    },
    sendVerificationEmail(email: string) {
        const user = Accounts.findUserByEmail(email);
        Accounts.sendVerificationEmail(user!._id);
    },
    sendPasswordResetEmail(email) {
        const user = Accounts.findUserByEmail(email);
        if (!user?.emails[0].verified) {
            Accounts.sendVerificationEmail(user!._id);
        }
        Accounts.sendResetPasswordEmail(user!._id);
    }
});
