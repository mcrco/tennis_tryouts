import React from 'react'
import { useTracker } from 'meteor/react-meteor-data'
import { RecordCollection } from '/imports/api/records.js'

function player_record(player) {
    p_rec = []
    for (let rec in RecordCollection.find({}).fetch()) {
        if (rec.p1 == player) {
            const didWin = rec.s1 > rec.s2
            const res = didWin ? 'win' : 'loss'

            p_prec.append({
                opponent: rec.p2,
                result: res,
                my_score: 
            })
        }
    }
}

function win_count(player) {
    count = 0
    for (let rec of records)
}