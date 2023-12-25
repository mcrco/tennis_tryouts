import { Meteor } from 'meteor/meteor';
import { MatchCollection, SessionCollection } from '/imports/api/collections'

Meteor.methods({
    insertMatch(match) {
        return MatchCollection.insert(match);
    },
    removeMatch(selector) {
        return MatchCollection.remove(selector)
    },
    insertSession(match) {
        return SessionCollection.insert(match);
    },
    removeSession(selector) {
        return SessionCollection.remove(selector);
    },
})

Meteor.publish('allMatches', () => {
    return MatchCollection.find();
})

Meteor.publish('allSessions', () => {
    return SessionCollection.find();
})

