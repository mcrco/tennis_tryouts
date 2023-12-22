import React, { useState } from 'react';
import { useTracker } from 'meteor/react-meteor-data'
import { SessionView, SessionViewProps } from './session-view';
import { SessionFinder } from './session-finder';
import { LoginForm } from './login-form';
import { Dashboard } from './dashboard';
import { PopupModal } from './components/modal';
import { Meteor } from 'meteor/meteor';

export const App = () => {
    const userId = useTracker(() => Meteor.userId());
    const [sessionCode, setSessionCode] = useState('');
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [showSessionFinderModal, setShowSessionFinderModal] = useState(false);

    // Render session view if session code isn't empty
    if (sessionCode != '' && sessionCode != null) {
        const sessionViewProps: SessionViewProps = {
            sessionCode: sessionCode,
            setSessionCode: setSessionCode
        }
        return <SessionView {...sessionViewProps} />
    }

    // Return login form if user isn't logged in
    else if (userId == null) {
        return (
            <div className='flex flex-col items-start space-y-8'>
                <div className='w-full flex flex-row justify-between items-center'>

                    <h1> Tennis Ranker </h1>
                    <div className='flex flex-row space-x-4 h-12'>
                        <button className='rounded-lg px-4 py-2 bg-green-500 text-white font-bold hover:shadow-md transition-shadow' onClick={() => setShowLoginModal(true)}>
                            Log In
                        </button>
                        <button className='rounded-lg px-4 py-2 bg-green-500 text-white font-bold hover:shadow-md transition-shadow' onClick={() => setShowSessionFinderModal(true)}>
                            View Session
                        </button>
                    </div>
                </div>

                <span className='text-lg'>
                    An <a href='https://github.com/mcrco/tennis_tryouts'>open-source app</a> that helps you track matches and rank players,
                    whether its for tryouts or a tournament.
                </span>

                <div className='space-y-8'>
                    <h2> Features </h2>
                    <div className='flex flex-col items-center border rounded-3xl border-gray-200 bg-gray-100'>
                        <div className='flex flex-row justify-between items-start p-12 border-b border-gray-200'>
                            <div className='w-1/3 text-left'>
                                <h3 className='mb-4'> Coach Dashboard </h3>
                                Manage multiple sessions for different ocassions, share results with others.
                            </div>
                            <div className='p-8 border border-gray-200 rounded-lg shadow-lg w-1/2 bg-white'>
                                <img src='sessions.png' className='w-full' />
                            </div>
                        </div>
                        <div className='flex flex-row justify-between items-start p-12  border-b border-gray-200'>
                            <div className='w-1/3 text-left'>
                                <h3 className='mb-4'> Match List </h3>
                                View matches in every session, filter matches by player.
                            </div>
                            <div className='p-8 border border-gray-200 rounded-lg shadow-lg w-1/2 bg-white'>
                                <img src='matchlist.png' className='w-full' />
                            </div>
                        </div>
                        <div className='flex flex-row justify-between items-start p-12  border-b border-gray-200'>
                            <div className='w-1/3 text-left'>
                                <h3 className='mb-4'> Leaderboard </h3>
                                View your players by wins or by rank, determined via our comparison algorithm (more about this in the next feature).
                            </div>
                            <div className='p-8 border border-gray-200 rounded-lg shadow-lg w-1/2 bg-white'>
                                <img src='leaderboard.png' className='w-full' />
                            </div>
                        </div>
                        <div className='flex flex-row justify-between items-start p-12 '>
                            <div className='w-1/3 text-left'>
                                <h3 className='mb-4'> Compare Players </h3>
                                Compare two players who have (or haven't!) played with each other. The app automatically finds positive h2h chains, demonstrated on the right.
                            </div>
                            <div className='p-8 border border-gray-200 rounded-lg shadow-lg w-1/2 bg-white'>
                                <img src='compare.png' className='w-full' />
                            </div>
                        </div>
                    </div>
                </div>

                <PopupModal visible={showLoginModal} body={<LoginForm />} toggleVisible={() => setShowLoginModal(false)} />
                <PopupModal visible={showSessionFinderModal} body={<SessionFinder setSessionCode={setSessionCode} />} toggleVisible={() => setShowSessionFinderModal(false)} />
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
