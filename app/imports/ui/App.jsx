import React, {useState} from 'react';
import MatchList from './components/match-list'
import Leaderboard from './components/leaderboard';
import Comparator from './components/comparator';
import {GiTennisRacket} from 'react-icons/gi'
import {BsList} from 'react-icons/bs'
import {BsTrophy} from 'react-icons/bs'
import {BsPeople} from 'react-icons/bs'

export const App = () => {

    const [display, setDisplay] = useState('match-list')

    const displayingMatches = display == 'match-list'
    const displayingLb = display == 'leaderboard'
    const displayingComp = display == 'comparison'

    const returnDisplay = () => {
        if (displayingMatches) {
            return (<MatchList/>)
        } else if (displayingLb) {
            return (<Leaderboard/>)
        } else if (displayingComp) {
            return (<Comparator/>)
        }
    }

    return (
      <div className=''>

        {/* <div className='vertical-center'> */}
        {/* </div> */}

        {/* <div className='vertical-center'> */}
        {/*     <GiTennisRacket className='margin-right' style={{fontSize: '64px'}}/> */}
        {/*     <h1> msj tennis </h1> */}
        {/* </div> */}

        <div id="navbar-container">
            <div id="navbar" className="row rounded black-shadow vertical-center">
                <div 
                    className='row-element nav-element rounded-left' 
                    style={{
                            backgroundColor: displayingMatches ? 'var(--accent)': 'white', 
                            color: displayingMatches ? 'white' : 'black'}} 
                    onClick={() => {setDisplay('match-list')}}>
                    <div className='vertical-center' style={{height: '50px'}}>
                        <BsList/>
                    </div>
                </div>
                <div 
                    className='row-element nav-element' 
                    style={{
                            backgroundColor: displayingLb ? 'var(--accent)': 'white', 
                            color: displayingLb ? 'white' : 'black'}} 
                    onClick={() => {setDisplay('leaderboard')}}>
                    <div className='vertical-center' style={{height: '50px'}}>
                        <BsTrophy/>
                    </div>
                </div>
                <div 
                    className='row-element nav-element rounded-right' 
                    style={{
                            backgroundColor: displayingComp ? 'var(--accent)': 'white', 
                            color: displayingComp ? 'white' : 'black'}} 
                    onClick={() => {setDisplay('comparison')}}>
                    <div className='vertical-center' style={{height: '50px'}}>
                        <BsPeople/>
                    </div>
                </div>
            </div>
        </div>

        <div style={{height: '50px'}}></div>

        {returnDisplay()}
      </div>
    )
};
