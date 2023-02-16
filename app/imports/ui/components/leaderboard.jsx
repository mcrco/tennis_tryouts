import React, {useState} from 'react'
import { useTracker } from 'meteor/react-meteor-data'
import { MatchCollection } from '/imports/api/collections.js'
import playerUtil from '../../util/player-util'

export default function Leaderboard() {

    const matches = useTracker(() => MatchCollection.find().fetch())
    let players = []
    for (const match of matches) {
        if (!players.includes(match.p1)) {
            players.push(match.p1)
        }
        if (!players.includes(match.p2)) {
            players.push(match.p2)
        }
    }

    const sortFn = (p1, p2) => {
        return playerUtil.bfs_comp_val(p1, p2)
    }

    players.sort(sortFn)

    const rows = players.map(
        (player) => (
            <div className='list-entry black-shadow rounded' style={{width: '60%'}}>
                <div className='list-entry-name'>
                    {player}
                </div>
                <div className='list-entry-wins horizontal-center'>
                    {playerUtil.win_count(player)}
                    <div className='list-entry-sub'>
                        Wins
                    </div>
                </div>
                <div className='list-entry-rank horizontal-center'>
                    {players.indexOf(player) + 1}
                    <div className='list-entry-sub'>
                        Rank
                    </div>
                </div>
            </div>
        )
    )

    console.log(rows)
    
    return (
        <div className='centered'> 
            <div className='list'>
                {rows}
            </div>
        </div>
    )
}
