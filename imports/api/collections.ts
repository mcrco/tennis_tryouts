import { Mongo } from 'meteor/mongo';

export const MatchCollection = new Mongo.Collection('matches');
export const PlayerCollection = new Mongo.Collection('players')
export const SessionCollection = new Mongo.Collection('sessions')
