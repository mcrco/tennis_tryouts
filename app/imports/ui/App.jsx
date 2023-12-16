import React, { useState } from 'react';
import { useTracker } from 'meteor/react-meteor-data'
import { SessionView } from './session-view';
import { SessionFinder } from './session-finder';
import { LoginForm } from './login-form';
import { Dashboard } from './dashboard';

export const App = () => {
    const user = useTracker(() => Meteor.user());
    const [sessionCode, setSessionCode] = useState('');

    // Render session view if session code isn't empty
    if (sessionCode != '' && sessionCode != null) {
        return <SessionView sessionCode={sessionCode} setSessionCode={setSessionCode} />
    }

    // Return login form if user isn't logged in
    else if (user == undefined) {
        return (
            <div className='flex flex-col items-center justify-center space-y-8'>
                <LoginForm />
                <span> or </span>
                <SessionFinder setSessionCode={setSessionCode} />
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
