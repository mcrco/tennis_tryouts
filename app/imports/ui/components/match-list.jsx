import React from 'react'
import { useTracker } from 'meteor/react-meteor-data'
import { MatchCollection } from '/imports/api/collections.js'

export default function MatchList() {
    
    const matches = useTracker(() => MatchCollection.find().fetch())

    const rows = matches.map(
        (match) => (
            <div className='list-entry black-shadow rounded'>
                <div className='list-entry-left' style={{'--color': match.s1 > match.s2 ? '#009879' : 'red'}}>
                    {match.p1}
                </div>
                <div className='list-entry-center rounded'>
                    {match.s1 + ' - ' + match.s2}
                </div>
                <div className='list-entry-right' style={{'--color': match.s1 > match.s2 ? 'red' : '#009879'}}>
                    {match.p2}
                </div>
            </div>
        )
    )
    
    const handleAddMatch = () => {
        const p1 = document.getElementById('p1').value
        const p2 = document.getElementById('p2').value
        const s1 = document.getElementById('s1').value
        const s2 = document.getElementById('s2').value
        
        const new_rec = {
            p1: p1,
            p2: p2,
            s1: s1,
            s2: s2
        }
        
        MatchCollection.insert(new_rec)
    }

    return (
        <div className='rounded'>
            <div className='row'>
                <input className='row-element black-shadow' type='text' id='p1' name='p1-input' placeholder='Player 1 Name'  />
                <input className='row-element black-shadow' type='text' id='p2' name='p2-input' placeholder='Player 2 Name' />
                <input className='row-element black-shadow' type='text' id='s1' name='s1-input' placeholder='Player 1 Score'/>
                <input className='row-element black-shadow' type='text' id='s2' name='s2-input' placeholder='Player 2 Score'/>
                <button className='row-element black-shadow' onClick={handleAddMatch}>Add Match</button>
            </div>
        
            <div style={{height: '50px'}}></div>
        
            <div className='list'>
                {rows}
            </div>
        </div>
    )
}