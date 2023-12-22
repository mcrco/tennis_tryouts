import { Meteor } from 'meteor/meteor';
import React, { useState } from 'react';
import { Accounts } from 'meteor/accounts-base';

export const LoginForm = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loginError, setLoginError] = useState('');
    const [createAccError, setCreateAccError] = useState('');

    const handleLogIn = (e: React.MouseEvent<HTMLFormElement>) => {
        e.preventDefault();

        const callback = (err?: Error) => {
            if (err != null) {
                setCreateAccError('');
                setLoginError(err.message);
            }
        }

        Meteor.loginWithPassword(username, password, callback);
    };

    const handleCreateAccount = (e: React.MouseEvent) => {
        e.preventDefault();

        const callback = (err?: Error) => {
            if (err != null) {
                setLoginError('');
                setCreateAccError(err.message);
            } else {
                Meteor.loginWithPassword(username, password);
            }
        }

        Accounts.createUser({ username: username, password: password }, callback);
    }

    // const handleForgotPassword = (e: React.MouseEvent) => {
    //     e.preventDefault();
    //     Accounts.forgotPassword({email: username});
    // }

    return (
        <form onSubmit={handleLogIn} className="flex flex-col space-y-4 justify-center items-center rounded-lg shadow-md p-4 bg-gray-100">
            <input
                type="text"
                placeholder="Username"
                className='px-4 py-3 bg-white rounded-lg w-full'
                name="username"
                required
                onChange={e => setUsername(e.target.value)}
            />

            <input
                type="password"
                placeholder="Password"
                className='px-4 py-3 bg-white rounded-lg w-full'
                name="password"
                required
                onChange={e => setPassword(e.target.value)}
            />

            {(loginError != '') &&
                <span className={'text-red-500 text-sm'}>
                    {loginError}
                </span>
            }

            {(createAccError != '') &&
                <span className={'text-red-500 text-sm'}>
                    {createAccError}
                </span>
            }

            <div className='flex flex-row justify-center items-center space-x-4'>
                <button className='bg-green-500 px-4 py-3 rounded-lg text-white font-bold hover:shadow-md transition-shadow' type="submit">Log In</button>
                <button className='bg-green-500 px-4 py-3 rounded-lg text-white font-bold hover:shadow-md transition-shadow' onClick={handleCreateAccount}>Create Account</button>
            </div>
        </form>
    );
};
