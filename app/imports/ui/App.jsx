import React, {useState} from 'react';
import { useTracker } from 'meteor/react-meteor-data'
import MatchList from './components/match-list'
import Leaderboard from './components/leaderboard';
import Comparator from './components/comparator';
import {SessionCollection} from '/imports/api/collections.js'
import {BsList, BsTrophy} from 'react-icons/bs'
import {BsPeople} from 'react-icons/bs'

export const App = () => {

    const [display, setDisplay] = useState('match-list')

    const displayingMatches = display == 'match-list'
    const displayingLb = display == 'leaderboard'
    const displayingComp = display == 'comparison'
    
    const sessions = useTracker(()=> SessionCollection.find().fetch())
    const sessionOpts = sessions.map(
        (session) => (
            <option value={session._id}>{session.name}</option>
        )
    )

    const [sessionId, setSessionId] = useState('-1')
    const returnDisplay = () => {
        if (displayingMatches) {
            return (<MatchList sessionId={sessionId}/>)
        } else if (displayingLb) {
            return (<Leaderboard sessionId={sessionId}/>)
        } else if (displayingComp) {
            return (<Comparator sessionId={sessionId}/>)
        }
    }

    const handleSelectChange = (event) => {
        setSessionId(event.target.value)
    }


    const handleAddSession = () => {
        const sessionName = document.getElementById('session-name').value
        if (!sessionName) {
            return
        }
        const new_session = {
            name: sessionName
        }
        
        SessionCollection.insert(new_session)
    }

    return (
      <div>

        <div className='row'>

            <div id='session-input-container' className='row rounded-left' style={{borderRight: 'none'}}>
                <input className='row-element rounded-left' type='text' id='session-name' name='session-input' placeholder='Session Name'/>
            </div>
            <button id='add-session' className='row-element rounded-right margin-right' onClick={handleAddSession}>Add Session</button>
        
            <div id='session-selector-container' className='row-element margin-right'>
                <select name='sessions' id='session-select' className='rounded' onChange={handleSelectChange}>
                    {sessionOpts}
                </select>
            </div>
                 

            <div id="navbar-container" className='row-element'>
                <div id="navbar" className="row rounded vertical-center">
                    <div 
                        className='row-element nav-element rounded-left' 
                        style={{
                                backgroundColor: displayingMatches ? 'var(--accent)': 'var(--light-grey)', 
                                color: displayingMatches ? 'white' : 'black'}} 
                        onClick={() => {setDisplay('match-list')}}>
                        <div className='vertical-center' style={{height: '50px'}}>
                            <BsList/>
                        </div>
                    </div>
                    <div 
                        className='row-element nav-element' 
                        style={{
                                backgroundColor: displayingLb ? 'var(--accent)': 'var(--light-grey)', 
                                color: displayingLb ? 'white' : 'black'}} 
                        onClick={() => {setDisplay('leaderboard')}}>
                        <div className='vertical-center' style={{height: '50px'}}>
                            <BsTrophy/>
                        </div>
                    </div>
                    <div 
                        className='row-element nav-element rounded-right' 
                        style={{
                                backgroundColor: displayingComp ? 'var(--accent)': 'var(--light-grey)', 
                                color: displayingComp ? 'white' : 'black'}} 
                        onClick={() => {setDisplay('comparison')}}>
                        <div className='vertical-center' style={{height: '50px'}}>
                            <BsPeople/>
                        </div>
                    </div>
                </div>
            </div>

        </div>

        <div style={{height: '50px'}}></div>

        {returnDisplay()}
      </div>
    )
};
