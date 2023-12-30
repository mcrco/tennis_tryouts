import { Meteor } from 'meteor/meteor';
import React, { useState } from 'react';
import { Accounts } from 'meteor/accounts-base';

export const LoginForm = () => {
    const [email, setEmail] = useState('');
    // const [username, setUsername] = useState('');
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
        // Meteor.loginWithPassword(username, password, callback);
    };

    const handleCreateAccount = (e: React.MouseEvent) => {
        e.preventDefault();

        const callback = (err?: Meteor.Error | Error) => {
            if (err != null && err instanceof Meteor.Error) {
                setCreateAccError(err.reason as string);
                setLoginError('');
            }
        }

        Meteor.call('createUserAccount', { email: email, password: password }, callback);
        // Accounts.createUser({ username: username, password: password });
    }

    const handleForgotPassword = (e: React.MouseEvent) => {
        e.preventDefault();
        Meteor.call('sendPasswordResetEmail', email);
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
            {/* <input */}
            {/*     type="text" */}
            {/*     placeholder="Username" */}
            {/*     className='px-4 py-3 bg-white rounded-lg w-full' */}
            {/*     name="username" */}
            {/*     required */}
            {/*     onChange={e => setUsername(e.target.value)} */}
            {/* /> */}

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
                <button className='rounded-lg px-4 py-2 bg-green-200 border border-transparent text-green-500 font-bold hover:shadow-md hover:border-green-400 transition-all' type="submit">
                    Log In
                </button>
                <button className='rounded-lg px-4 py-2 bg-green-200 border border-transparent text-green-500 font-bold hover:shadow-md hover:border-green-400 transition-all'
                    onClick={handleCreateAccount}>
                    Create Account
                </button>
            </div>
        </form>
    );
};
