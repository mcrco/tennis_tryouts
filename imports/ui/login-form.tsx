import { Meteor } from 'meteor/meteor';
import React, { useState } from 'react';
import { Accounts } from 'meteor/accounts-base';

export const LoginForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loginError, setLoginError] = useState('');
    const [createAccError, setCreateAccError] = useState('');

    const handleLogIn = (e: React.MouseEvent<HTMLFormElement>) => {
        e.preventDefault();

        const callback = (err?: Meteor.Error | Error) => {
            if (err != null && err instanceof Meteor.Error) {
                setCreateAccError('');
                setLoginError(err.reason as string);
            }
        }

        Meteor.loginWithPassword({ email: email }, password, callback);
    };

    const handleCreateAccount = (e: React.MouseEvent) => {
        e.preventDefault();

        const callback = (err?: Meteor.Error | Error) => {
            if (err != null && err instanceof Meteor.Error) {
                setLoginError('');
                setCreateAccError(err.reason as string);
            } else {
                Meteor.loginWithPassword(email, password);
            }
        }

        Meteor.call('createUserAccount', { email: email, password: password });
    }

    const handleForgotPassword = (e: React.MouseEvent) => {
        e.preventDefault();
        Accounts.forgotPassword({ email: email });
    }

    return (
        <form onSubmit={handleLogIn} className="flex flex-col space-y-4 justify-center items-center rounded-lg shadow-md p-4 bg-gray-100">
            <input
                type="text"
                placeholder="Email"
                className='px-4 py-3 bg-white rounded-lg w-full'
                name="email"
                required
                onChange={e => setEmail(e.target.value)}
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
                    {loginError}. <a onClick={handleForgotPassword}> Forgot password? </a>
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
