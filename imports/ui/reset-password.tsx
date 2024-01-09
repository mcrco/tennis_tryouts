import React from "react";
import { Accounts } from "meteor/accounts-base";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { Meteor } from "meteor/meteor";

export const ResetPasswordPage = () => {
    const [password, setPassword] = useState('');
    const [confPassword, setConfPassword] = useState('');
    const [resetError, setResetError] = useState('');
    const [resetSuccess, setResetSuccess] = useState(false);
    const params = useParams();
    const token = params.token;

    const handleResetPassword = () => {
        if (password != confPassword) {
            setResetError('Passwords not matching.');
            setResetSuccess(false);
            return;
        }
        Accounts.resetPassword(token!, password, (error?) => {
            if (error instanceof Meteor.Error) {
                console.log(error);
                setResetError(error.reason as string);
            } else {
                console.log('Password Reset')
                setResetError('');
                setResetSuccess(true);
                window.location.replace('/');
            }
        })
    }


    return (
        <div className="flex flex-row justify-center items-center">
            <div className="flex flex-col space-y-4 justify-center items-center rounded-lg shadow-md p-4 bg-gray-100">
                <input
                    type="password"
                    placeholder="Password"
                    className='px-4 py-3 bg-white rounded-lg w-full'
                    name="pass"
                    required
                    onChange={e => setPassword(e.target.value)}
                />

                <input
                    type="password"
                    placeholder="Confirm Password"
                    className='px-4 py-3 bg-white rounded-lg w-full'
                    name="confPass"
                    required
                    onChange={e => setConfPassword(e.target.value)}
                />

                {(resetError != '') &&
                    <span className={'text-red-500 text-sm'}>
                        {resetError}
                    </span>
                }

                {resetSuccess &&
                    <span className={'text-green-500 text-sm'}>
                        Password reset!
                    </span>
                }
                <button className='rounded-lg px-4 py-2 bg-green-200 border border-transparent text-green-500 font-bold hover:shadow-md hover:border-green-400 transition-all'
                    onClick={handleResetPassword}>
                    Reset Password
                </button>
            </div>
        </div>
    )
}

