import React, { useState } from 'react'
import { useTracker } from 'meteor/react-meteor-data'
import { MatchCollection } from '/imports/api/collections.js'
import playerUtil from '../../util/player-util'
import {BiSearch} from 'react-icons/bi'
import {TbArrowsSort} from 'react-icons/tb'

export default function Leaderboard() {

    const [searchedName, setSearchedName] = useState("")
    const [sortReverse, setSortReverse] = useState(false)


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
        return (sortReverse ? -1 : 1) * playerUtil.bfs_comp_val(p1, p2)
    }

    players.sort(sortFn)

    const handleSearch = (event) => {
        setSearchedName(event.target.value)
    }

    const handleReverse = () => {
        setSortReverse(!sortReverse)
    }

    const rows = players.map(
        (player) => player.includes(searchedName) ? (
            <div className='list-entry black-shadow rounded' style={{width: '60%'}} key={'Rank ' + sortReverse ? (players.length - players.indexOf(player)) : players.indexOf(player)}>
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
                    {sortReverse ? (players.length - players.indexOf(player)) : players.indexOf(player) + 1}
                    <div className='list-entry-sub'>
                        Rank
                    </div>
                </div>
            </div>
        ) : (<div />)
    )

    return (
        <div className='centered'> 
            <h1> Leaderboard </h1>

            <div style={{height: '50px', width: '100%'}} />

            <div className='row'>
                <div id='match-search-container' className='row rounded grey-outline margin-right'>
                    <div id='player-search' className='vertical-center'>
                        <BiSearch className='row-element' style={{fontSize: '1.1em', color: 'grey'}}/>
                        <input className='row-element rounded' type='text' name='player-search' onChange={handleSearch} placeholder="Search for player"/>
                    </div>
                </div>
                <button id='reverse-sort-btn' className='row-element rounded margin-right' style={{fontSize: '1em'}} onClick={handleReverse}> <TbArrowsSort/> </button>
            </div>

            <div style={{width: '100%', height: '30px'}}></div>

            <div className='list'>
                {rows}
            </div>
        </div>
    )
}
