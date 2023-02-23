import React, {useState} from 'react'
import { useTracker } from 'meteor/react-meteor-data'
import { MatchCollection } from '/imports/api/collections.js'
import PlayerUtil from '../../util/player-util'

export default function Comparator(props) {

    const [player1, setP1] = useState('!')
    const [player2, setP2] = useState('!')

    const matches = useTracker(() => MatchCollection.find({sessionId: props.sessionId}).fetch())
    const playerUtil = new PlayerUtil(matches)

    const dateToString = (date) => {
        return new Date(date).toLocaleString('en-US', {dateStyle: 'medium'}) 
    }

    let matchChains = []

    let p1 = player1.toLowerCase().trim()
    let p2 = player2.toLowerCase().trim()
    let p1_words = p1.split(' ')
    if (p1 != '') {
        for (let i = 0; i < p1_words.length; i++) {
            p1_words[i] = p1_words[i][0].toUpperCase() + p1_words[i].substring(1)
        }
    }
    p1 = p1_words.join(' ')

    let p2_words = p2.split(' ')
    if (p2 != '') {
        for (let i = 0; i < p2_words.length; i++) {
            p2_words[i] = p2_words[i][0].toUpperCase() + p2_words[i].substring(1)
        }
    }
    p2 = p2_words.join(' ')

    if (playerUtil.hasPlayer(p1) && playerUtil.hasPlayer(p2)) {
        matchChains = playerUtil.bfs_comp(p1, p2)
    }

    let chainLists = []
    for (const chain of matchChains) {
        chainLists.push(
            chain.map((match) => (
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

    let lists = chainLists.map((list) => (
        <div style={{width: '100%'}}>
            <h2> {list.length} Degrees </h2>
            <div className='list rounded margin-bottom' style={{paddingBottom: '20px', border: '1px dotted grey'}}>
                {list}
                {list.length % 2 == 1 ?
                    <div className='list-entry rounded'>
                        <div className='list-entry-left rounded-left'/>
                        <div className='list-entry-center rounded horizontal-center'/>
                        <div className='list-entry-right rounded-right'/>
                    </div> :
                    <div/>
                }
            </div>
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
                <div id='comp-search' className='row rounded'>
                    <input className='row-element rounded-left' type='text' id='p1' name='p1-input' placeholder='Player 1 Name' onChange={handleP1Search}/>
                    <input className='row-element rounded-right' type='text' id='p2' name='p2-input' placeholder='Player 2 Name' onChange={handleP2Search} style={{border: 'none'}}/>
                </div>
            </div>

            <div style={{width: '100%', height: '30px'}}></div>
            {lists}
        </div>
    )
}
