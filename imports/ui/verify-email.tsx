import React, { useEffect } from "react";
import { Accounts } from "meteor/accounts-base";
import { useState } from "react";
import { useParams } from "react-router-dom";

export const EmailVerificationPage = () => {
    const [verified, setVerified] = useState(false);
    const [message, setMessage] = useState('');
    const params = useParams();
    const token = params.token;

    useEffect(() => {
        Accounts.verifyEmail(token!, (error?) => {
            if (error != null && !verified) {
                console.log(error);
                setMessage(error.reason + ". Failed to verify email. But don't worry! it's only necessary for resetting password, and you'll get another verification email if you ever need to.");
            } else {
                console.log('Email verified')
                setVerified(true);
                setMessage('Email Verified! You should be logged in on the original tab.');
            }
        })
    })


    return (
        <div className="flex flex-row justify-center items-center">
            {message}
        </div>
    )
}
