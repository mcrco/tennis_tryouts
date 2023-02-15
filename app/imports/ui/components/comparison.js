import React, {useState} from 'react'
import { useTracker } from 'meteor/react-meteor-data'
import { MatchCollection } from '/imports/api/collections.js'
import playerUtil from '../../util/player-util'

export default function Comparison() {

    const [player1, setP1] = useState()
    const [player2, setP2] = useState()

    const all_matches = useTracker(() => MatchCollection.find().fetch())

    const bfs_list = () => {
        path = playerUtil.bfs_comp(player1, player2)
        if (path == -1) {
            return (<div></div>)
        }

        return path.map((pair) => {
            <div className='list-entry black-shadow rounded'>
                <div className='list-entry-left rounded-left' style={{'--color': match.s1 > match.s2 ? 'var(--green)' : 'var(--red)'}}>
                    {match.p1}
                </div>
                <div className='list-entry-center rounded horizontal-center'>
                    <div>{match.s1 + ' - ' + match.s2}</div> 
                    <div style={{height: '5px'}}></div>
                    <div className='list-entry-sub'>{dateToString(match.date)}</div>
                </div>
                <div className='list-entry-right rounded-right' style={{'--color': match.s1 > match.s2 ? 'var(--red)' : 'var(--green)'}}>
                    {match.p2}
                </div>
            </div>
                    
        })
    }

    

    const dateToString = (date) => {
        return new Date(date).toLocaleString('en-US', {dateStyle: 'medium'}) 
    }

    const rows = matches.map(
        (match) => (
            <div className='list-entry black-shadow rounded'>
                <div className='list-entry-left rounded-left' style={{'--color': match.s1 > match.s2 ? 'var(--green)' : 'var(--red)'}}>
                    {match.p1}
                </div>
                <div className='list-entry-center rounded horizontal-center'>
                    <div>{match.s1 + ' - ' + match.s2}</div> 
                    <div style={{height: '5px'}}></div>
                    <div className='list-entry-sub'>{dateToString(match.date)}</div>
                </div>
                <div className='list-entry-right rounded-right' style={{'--color': match.s1 > match.s2 ? 'var(--red)' : 'var(--green)'}}>
                    {match.p2}
                </div>
            </div>
        )
    )
    
    const handleSearch = (event) => {
        setSearchedName(event.target.value)
    }

    return (
        <div className='centered'> 
            <div className='row'>
                <div id='match-input-container' className='row rounded-left grey-outline' style={{borderRight: 'none'}}>
                    <input className='row-element rounded-left' type='text' id='p1' name='p1-input' placeholder='Player 1 Name'/>
                    <input className='row-element' type='text' id='p2' name='p2-input' placeholder='Player 2 Name' />
                </div>
                <button id='add-match' className='row-element rounded-right margin-right' style={{height: '52px'}} onClick={handleAddMatch}>Add Match</button>
            </div>

            <div style={{width: '100%', height: '30px'}}></div>
        
            <div className='list'>
                {rows}
            </div>
        </div>
    )
}
