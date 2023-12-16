import React, { useState } from 'react';
import { useTracker } from 'meteor/react-meteor-data'
import { SessionView } from './session-view';
import { SessionFinder } from './session-finder';
import { LoginForm } from './login-form';
import { Dashboard } from './dashboard';
import { PopupModal } from './components/modal';

export const App = () => {
    const user = useTracker(() => Meteor.user());
    const [sessionCode, setSessionCode] = useState('');
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [showSessionFinderModal, setShowSessionFinderModal] = useState(false);

    // Render session view if session code isn't empty
    if (sessionCode != '' && sessionCode != null) {
        return <SessionView sessionCode={sessionCode} setSessionCode={setSessionCode} />
    }

    // Return login form if user isn't logged in
    else if (user == undefined) {
        return (
            <div className='flex flex-col items-start space-y-16'>
                <div className='w-full flex flex-row justify-between items-center'>

                    <h1> Tennis Ranker </h1>
                    <div className='flex flex-row space-x-4 h-12 w-72'>
                        <button className='rounded-lg px-4 py-2 bg-green-500 text-white w-1/2' onClick={e => setShowLoginModal(true)}>
                            Log In
                        </button>
                        <button className='rounded-lg px-4 py-2 bg-green-500 text-white w-1/2' onClick={e => setShowSessionFinderModal(true)}>
                            View Session
                        </button>
                    </div>
                </div>

                <span>
                    An <a href='https://github.com/mcrco/tennis_tryouts'>open-source app</a> that helps you track matches and rank players,
                    whether its for tryouts or a tournament.
                </span>

                {/* <div className='flex flex-col space-y-16 px-8 py-4 shadow-md rounded-lg'> */}
                <h2> Features </h2>

                <div className='flex flex-col space-y-16 items-center'>
                    <div className='flex flex-row justify-between items-start pb-16 border-b border-gray-200'>
                        <div className='w-1/2 text-left'>
                            <h3 className='mb-4'> Coach Dashboard </h3>
                            Manage multiple sessions for different ocassions, share results with others.
                        </div>
                        <div className='p-8 border border-gray-200 rounded-lg shadow-lg w-1/2'>
                            <img src='sessions.png' className='w-full' />
                        </div>
                    </div>
                    <div className='flex flex-row justify-between items-start pb-16 border-b border-gray-200'>
                        <div className='w-1/2 text-left'>
                            <h3 className='mb-4'> Match List </h3>
                            View matches in every session, filter matches by player.
                        </div>
                        <div className='p-8 border border-gray-200 rounded-lg shadow-lg w-1/2'>
                            <img src='matchlist.png' className='w-full' />
                        </div>
                    </div>
                    <div className='flex flex-row justify-between items-start pb-16 border-b border-gray-200'>
                        <div className='w-1/3 text-left'>
                            <h3 className='mb-4'> Leaderboard </h3>
                            View your players by wins or by rank, determined via our comparison algorithm (more about this in the next feature).
                        </div>
                        <div className='p-8 border border-gray-200 rounded-lg shadow-lg w-1/2'>
                            <img src='leaderboard.png' className='w-full' />
                        </div>
                    </div>
                    <div className='flex flex-row justify-between items-start'>
                        <div className='w-1/3 text-left'>
                            <h3 className='mb-4'> Compare Players </h3>
                            Compare two players who have (or haven't!) played with each other. The app automatically finds "win chains," demonstrated on the right.
                        </div>
                        <div className='p-8 border border-gray-200 rounded-lg shadow-lg w-1/2'>
                            <img src='compare.png' className='w-full' />
                        </div>
                    </div>
                </div>

                <PopupModal visible={showLoginModal} body={<LoginForm />} toggleVisible={() => setShowLoginModal(false)} />
                <PopupModal visible={showSessionFinderModal} body={<SessionFinder setSessionCode={setSessionCode} />} toggleVisible={() => setShowSessionFinderModal(false)} />
                {/* </div> */}
            </div>
        )
    }

    else {
        return (
            <div className='p-1'>
                <Dashboard setSessionCode={setSessionCode} />
            </div>
        )
    }

};
