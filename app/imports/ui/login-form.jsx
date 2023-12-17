import { Meteor } from 'meteor/meteor';
import React, { useState } from 'react';

export const LoginForm = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const submit = e => {
        e.preventDefault();

        Meteor.loginWithPassword(username, password);
    };

    const createAccount = e => {
        e.preventDefault();

        Accounts.createUser({ username: username, password: password });
        Meteor.loginWithPassword(username, password);
    }

    return (
        <form onSubmit={submit} className="flex flex-col space-y-4 justify-center items-center rounded-lg shadow-md p-4 bg-gray-100">
            <input
                type="text"
                placeholder="Username"
                className='px-4 py-3 bg-white rounded-lg'
                name="username"
                required
                onChange={e => setUsername(e.target.value)}
            />

            <input
                type="password"
                placeholder="Password"
                className='px-4 py-3 bg-white rounded-lg'
                name="password"
                required
                onChange={e => setPassword(e.target.value)}
            />

            <div className='flex flex-row justify-center items-center space-x-4'>
                <button className='bg-green-500 px-4 py-3 rounded-lg text-white font-bold hover:shadow-md transition-shadow' type="submit">Log In</button>
                <button className='bg-green-500 px-4 py-3 rounded-lg text-white font-bold hover:shadow-md transition-shadow' onClick={createAccount}>Create Account</button>
            </div>
        </form>
    );
};
