import React, { useState } from 'react';
import { useTracker } from 'meteor/react-meteor-data'
import { MatchList, MatchListProps } from './components/match-list'
import { Leaderboard, LeaderboardProps } from './components/leaderboard';
import { Compare, CompareProps } from './components/compare';
import { SessionCollection } from '/imports/api/collections.ts'
import { BiArrowBack, BiGroup, BiListUl, BiSort } from 'react-icons/bi';
import { Meteor } from 'meteor/meteor';

export type SessionViewProps = {
    setSessionCode: (sessionCode: string) => void;
    sessionCode: string;
}

export const SessionView: React.FC<SessionViewProps> = (props) => {
    const [tabState, setTabState] = useState('matchlist');
    const userId = useTracker(() => Meteor.userId());

    // Load session
    Meteor.subscribe('allSessions');
    const session = useTracker(() => SessionCollection.findOne({ code: props.sessionCode }));
    if (session == undefined) {
        props.setSessionCode('');
    }

    const sessionId = session!._id;
    const ownerLoggedIn = userId != null && session!.owner == userId;

    const matchListProps: MatchListProps = {
        sessionId: sessionId,
        ownerLoggedIn: ownerLoggedIn
    };

    const leaderboardProps: LeaderboardProps = {
        sessionId: sessionId
    };

    const compareProps: CompareProps = {
        sessionId: sessionId
    };

    return (
        <div>
            <div className='flex flex-row justify-between w-full'>
                <div className='w-1/3 text-left flex items-center'>
                    <BiArrowBack className='cursor-pointer' onClick={() => { props.setSessionCode('') }} />
                </div>

                <div className="rounded-lg flex flex-row justify-between py-2 px-3 bg-gray-100 cursor-pointer w-1/2">
                    <div
                        className={'rounded-lg py-2 px-3 flex flex-row items-center justify-center space-x-2 w-1/3' + (tabState == 'matchlist' ? ' bg-white text-black shadow-md' : '')}
                        onClick={() => { setTabState('matchlist') }}>
                        <BiListUl className='text-xl' /> <div className='cursor-pointer'>Matches</div>
                    </div>
                    <div
                        className={'rounded-lg py-2 px-3 flex flex-row items-center justify-center space-x-2 w-1/3' + (tabState == 'leaderboard' ? ' bg-white text-black shadow-md' : '')}
                        onClick={() => { setTabState('leaderboard') }}>
                        <BiSort className='text' /> <div className='cursor-pointer'>Leaderboard</div>
                    </div>
                    <div
                        className={'rounded-lg py-2 px-3 flex flex-row items-center justify-center space-x-2 w-1/3' + (tabState == 'comparator' ? ' bg-white text-black shadow-md' : '')}
                        onClick={() => { setTabState('comparator') }}>
                        <BiGroup className='text-lg' /> <div className='cursor-pointer'>Compare</div>
                    </div>
                </div>

                <div className='w-1/3 text-left'></div>
            </div>

            <div style={{ height: '50px' }}></div>

            {tabState == 'matchlist' && (<MatchList {...matchListProps} />)}
            {tabState == 'leaderboard' && (<Leaderboard {...leaderboardProps} />)}
            {tabState == 'comparator' && (<Compare {...compareProps} />)}
        </div >
    )
};
