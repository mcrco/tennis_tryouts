import React, {useState} from 'react'
import { useTracker } from 'meteor/react-meteor-data'
import { MatchCollection } from '/imports/api/collections.js'
import {BiSearch} from 'react-icons/bi'
import {TbArrowsSort} from 'react-icons/tb'

export default function MatchList() {

    const [searchedName, setSearchedName] = useState("")
    const [sortReverse, setSortReverse] = useState(true)

    const all_matches = useTracker(() => MatchCollection.find().fetch())

    const matches = all_matches.filter(match => match.p1.includes(searchedName)|| match.p2.includes(searchedName))

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

    const sortFn = (m1, m2) => {
        sortReverse ? new Date(m2.date) - new Date(m1.date) : new Date(m1.date) - new Date(m2.date)
    }

    rows.sort(sortFn)
    
    const handleAddMatch = () => {
        const p1 = document.getElementById('p1').value
        const p2 = document.getElementById('p2').value
        const s1 = document.getElementById('s1').value
        const s2 = document.getElementById('s2').value
        let date = document.getElementById('match-date').value
        if (!p1 || !p2 || !s1 || !s2) {
            return
        }
        const today = new Date()
        if (dateToString(new Date(date)) == dateToString(today)) {
            date = today
        }
        
        const new_rec = {
            p1: p1,
            p2: p2,
            s1: s1,
            s2: s2,
            date: date
        }
        
        MatchCollection.insert(new_rec)
    }

    const handleSearch = (event) => {
        setSearchedName(event.target.value)
    }

    const handleReverse = () => {
        setSortReverse(!sortReverse)
    }

    return (
        <div className='centered'> 
            <div className='row'>
                <div id='match-input-container' className='row rounded-left grey-outline' style={{borderRight: 'none'}}>
                    <input className='row-element rounded-left' type='text' id='p1' name='p1-input' placeholder='Player 1 Name'/>
                    <input className='row-element' type='text' id='p2' name='p2-input' placeholder='Player 2 Name' />
                    <input className='row-element' style={{width: '9em'}} type='text' id='s1' name='s1-input' placeholder='Player 1 Score'/>
                    <input className='row-element' type='text' id='s2' name='s2-input' placeholder='Player 2 Score'/>
                    <input className='row-element' type='date' id='match-date' name='match-date-input' defaultValue={new Date()}/>
                </div>
                <button id='add-match' className='row-element rounded-right margin-right' style={{height: '52px'}} onClick={handleAddMatch}>Add Match</button>
            </div>

            <div style = {{width: '100%', height: '50px'}}></div>

            <div className='row'>
                <div id='match-search-container' className='row rounded grey-outline margin-right'>
                    <div className='vertical-center'>
                        <BiSearch className='row-element' style={{fontSize: '1.1em', color: 'grey'}}/>
                        <input className='row-element rounded' type='text' id='player-search' name='player-search' onChange={handleSearch} placeholder="Search for player's matches"/>
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
