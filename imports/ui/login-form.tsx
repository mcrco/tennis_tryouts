import { Meteor } from 'meteor/meteor';
import React, { useState } from 'react';

export const LoginForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loginError, setLoginError] = useState('');
    const [createAccError, setCreateAccError] = useState('');
    const [createAccSuccess, setCreateAccSuccess] = useState(false);

    const handleLogIn = (e: React.MouseEvent<HTMLFormElement>) => {
        e.preventDefault();

        const callback = (err?: Meteor.Error | Error) => {
            if (err != null && err instanceof Meteor.Error) {
                setCreateAccError('');
                setLoginError(err.reason as string);
                setCreateAccSuccess(false);
            }
        }

        Meteor.loginWithPassword({ email: email }, password, callback);
    };

    const handleCreateAccount = async (e: React.MouseEvent) => {
        e.preventDefault();

        let res = await Meteor.callAsync('createUserAccount', { email: email, password: password });

        if (res.error) {
            console.log(res.message as string);
            setCreateAccError(res.reason as string);
            setLoginError('');
            setCreateAccSuccess(false);
        } else {
            console.log('Account created');
            setCreateAccSuccess(true);
            setCreateAccError('');
            setLoginError('');
        }

    }

    const handleForgotPassword = (e: React.MouseEvent) => {
        e.preventDefault();
        Meteor.call('sendPasswordResetEmail', email);
        setLoginError('Password reset email sent')
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

            {createAccSuccess &&
                <span className={'text-green-500 text-sm'}>
                    Verification email sent!
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
