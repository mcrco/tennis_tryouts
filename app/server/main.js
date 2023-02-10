import { Meteor } from 'meteor/meteor';
import { MatchCollection } from '/imports/api/collections.js'

const insertMatch = rec => MatchCollection.insert(rec)

Meteor.startup(() => {
    if (MatchCollection.find().count() == 0) {
        insertMatch({
            p1: 'Marco',
            p2: 'Shrish',
            s1: 7,
            s2: 5
        })
    }
});