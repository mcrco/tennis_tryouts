import React, {useState} from 'react';
import MatchList from './components/match-list'
import {GiTennisRacket} from 'react-icons/gi'

export const App = () => {

    const [display, setDisplay] = useState('match-list')

    const displayingMatches = display == 'match-list'
    const displayingLb = display == 'leaderboard'
    const displayingComp = display == 'comparison'

    const returnDisplay = () => {
        if (displayingMatches) {
            return (<MatchList/>)
        } else if (displayingLb) {
            return ('')
        } else if (displayingComp) {
            return ('')
        }
    }

    return (
      <div className=''>

        <div className='vertical-center'>
        </div>

        <div className='vertical-center'>
            <GiTennisRacket className='margin-right' style={{fontSize: '64px'}}/>
            <h1> msj tennis </h1>
        </div>

        <div id="navbar-container">
            <div id="navbar" class="row rounded black-shadow vertical-center">
                <div 
                    className='row-element nav-element rounded-left active' 
                    style={{backgroundColor: displayingMatches ? 'var(--accent)': 'white', color: displayingMatches ? 'white' : 'black'}} 
                    onClick={() => {setDisplay('match-list')}}>
                    Match List
                </div>
                <div 
                    className='row-element nav-element' 
                    style={{backgroundColor: displayingLb ? 'var(--accent)': 'white', color: displayingLb ? 'white' : 'black'}} 
                    onClick={() => {setDisplay('leaderboard')}}>
                    Leaderboard
                </div>
                <div 
                    className='row-element nav-element rounded-right' 
                    style={{backgroundColor: displayingComp ? 'var(--accent)': 'white', color: displayingComp ? 'white' : 'black'}} 
                    onClick={() => {setDisplay('comparison')}}>
                    Comparisons
                </div>
            </div>
        </div>

        <div style={{height: '50px'}}></div>

        {returnDisplay()}
      </div>
    )
};
