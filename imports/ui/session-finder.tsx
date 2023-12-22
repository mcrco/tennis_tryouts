import React, { useState } from 'react';
import { useTracker } from 'meteor/react-meteor-data'
import { ErrorModal } from './components/modal';
import { SessionCollection } from '../api/collections';

export type SessionFinderProps = {
    setSessionCode: (sessionCode: string) => void;
}

export const SessionFinder = (props: SessionFinderProps) => {
    const [modalVisible, setModalVisible] = useState(false);
    const sessions = useTracker(() => SessionCollection.find().fetch());

    const handleClick = (e: React.MouseEvent) => {
        e.preventDefault();

        const sessionCode = (document.getElementById('session-code') as HTMLInputElement).value;
        if (sessions.filter((session) => session.code == sessionCode).length > 0) {
            props.setSessionCode(sessionCode);
        } else {
            setModalVisible(true);
        }
    }

    return (
        <div className='flex flex-col justify-center items-center bg-gray-100 p-4 rounded-lg space-y-4 shadow-md'>
            <input className='px-4 py-3 rounded-lg' type='text' id='session-code' placeholder='Session Code' />
            <button className='rounded-lg px-4 py-3 bg-green-500 text-white font-bold hover:shadow-md transition-shadow'
                onClick={handleClick}>
                View Session
            </button>
            <ErrorModal visible={modalVisible} header={'Error'} body={'Session not found'} toggleVisible={() => setModalVisible(false)} />
        </div >
    )
}  
