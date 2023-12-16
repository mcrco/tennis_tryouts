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
            <div className='flex flex-col items-start space-y-8'>
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
