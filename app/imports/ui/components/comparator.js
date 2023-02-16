import React, {useState} from 'react'
import playerUtil from '../../util/player-util'

export default function Comparator() {

    const [player1, setP1] = useState()
    const [player2, setP2] = useState()

    const dateToString = (date) => {
        return new Date(date).toLocaleString('en-US', {dateStyle: 'medium'}) 
    }

    const paths = playerUtil.bfs_comp(player1, player2)

    console.log(paths)

    let listEntryLists = []
    for (const path of paths) {
        listEntryLists.push(
            path.map((match) => (
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
        )
    }

    let lists = listEntryLists.map((list) => (
        <div className='list'>
            {list}
        </div>
    ))

    const handleP1Search = (event) => {
        setP1(event.target.value)
    }

    const handleP2Search = (event) => {
        setP2(event.target.value)
    }

    return (
        <div className='centered'> 
            <h1> Comparator </h1>
            <div style={{height: '50px', width: '100%'}} />
            <div className='row'>
                <div className='row grey-outline'>
                    <input className='row-element rounded-left' type='text' id='p1' name='p1-input' placeholder='Player 1 Name' onChange={handleP1Search}/>
                    <input className='row-element rounded-right' type='text' id='p2' name='p2-input' placeholder='Player 2 Name' onChange={handleP2Search}/>
                </div>
            </div>

            <div style={{width: '100%', height: '30px'}}></div>
        
            {lists}
        </div>
    )
}
