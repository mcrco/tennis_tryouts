import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data'
import React, { useState } from 'react';
import { SessionCollection, MatchCollection } from '../api/collections';
import { FaCheck, FaPlusCircle, FaTimes, FaTrash } from 'react-icons/fa';
import { Modal } from './components/modal';
import { SessionFinder } from './session-finder';
import { TbLogout } from 'react-icons/tb';
import { BiPlusCircle, BiTrash } from 'react-icons/bi';

// Dashboard that displays all sessions managed by coach
export const Dashboard = (props) => {
    const user = useTracker(() => Meteor.user());
    const sessions = useTracker(() => SessionCollection.find().fetch());
    const userSessions = sessions.filter(session => session.owner == user._id);

    // Activated by clicking add session tile
    const [isAddingSession, setIsAddingSession] = useState(false);
    // Used to render error modal for invalid session code on creation
    const [addSessionError, setAddSessionError] = useState(false);
    // Used to render session tab vs session finder tab
    const [tabState, setTabState] = useState('my');

    const deleteSession = sessionId => SessionCollection.removeAsync({ _id: sessionId });

    const sessionTiles = userSessions.map((session) => {
        const numMatches = MatchCollection.find({ sessionId: session._id }).count()
        return (
            <div className='rounded-lg bg-gray-100 h-auto flex flex-col hover:scale-105 transition-transform cursor-pointer group' onClick={() => props.setSessionCode(session.code)}>
                <div className='text-lg px-5 pt-4 pb-2 font-extrabold mb-3 border-b border-gray-200 flex flex-row justify-between items-center'>
                    <span>{session.name}</span>
                    <div className='invisible group-hover:visible hover:text-red-500' onClick={() => deleteSession(session._id)}>
                        <BiTrash />
                    </div>
                </div>
                <div className='px-5 pt-2 pb-4'>
                    <p>
                        Join Code: {session.code}
                    </p>
                    <p>
                        Created: {session.created == undefined ? '' : session.created.toLocaleDateString('en-US', { dateStyle: 'medium' })}
                    </p>
                    <p>
                        Matches: {numMatches}
                    </p>
                </div>
            </div>
        )
    })

    // Render add session tile with/without input boxes
    if (isAddingSession) {
        const handleAddSession = () => {
            const sessionName = document.getElementById('session-name-input').value;
            const joinCode = document.getElementById('join-code-input').value;
            if (sessions.filter(session => session.code == joinCode).length != 0) {
                setAddSessionError(true);
                return;
            }

            SessionCollection.insert({
                name: sessionName,
                code: joinCode,
                created: new Date(),
                owner: user._id
            })
            setIsAddingSession(false);
        };

        const handleCancelAddSession = () => {
            setIsAddingSession(false)
        };

        sessionTiles.push(
            <div className='rounded-lg p-5 bg-gray-100 shadow-md h-auto flex flex-col hover:scale-105 transition-transform space-y-2'>
                <div className='flex flex-row space-x-2'>
                    <input id='session-name-input' className='rounded-lg p-2 pl-3 bg-white w-3/4' placeholder='Session name' />
                    <button className='rounded-lg bg-white w-1/4 flex justify-center items-center text-gray-300 text-lg' onClick={() => handleAddSession()}>
                        <FaCheck />
                    </button>
                </div>
                <div className='flex flex-row space-x-2'>
                    <input id='join-code-input' className='rounded-lg p-2 pl-3 bg-white w-3/4' placeholder='Join code' />
                    <button className='rounded-lg bg-white w-1/4 flex justify-center items-center text-gray-300 text-lg' onClick={() => handleCancelAddSession()}>
                        <FaTimes />
                    </button>
                </div>
            </div>
        );
    } else {
        sessionTiles.push(
            <div className='rounded-lg border-dotted border-2 h-auto flex items-center justify-center transition-colors cursor-pointer text-gray-200 text-3xl hover:text-black hover:border-black'
                onClick={() => setIsAddingSession(true)}>
                <BiPlusCircle />
            </div>
        )
    }

    const renderTab = () => {
        if (tabState == 'my') {
            return (
                <div>
                    <div className='grid grid-cols-4 gap-8'>
                        {sessionTiles}
                    </div>
                    <Modal visible={addSessionError} header={'Error'} body={'Session join code already in use. Please try another.'} toggleVisible={() => setAddSessionError(false)} />
                </div>
            );
        } else if (tabState == 'other') {
            return <div className='flex justify-center items-center'> <SessionFinder setSessionCode={props.setSessionCode} /> </div>
        }
    }

    return (
        <div className='space-y-8'>
            <div className='flex flex-row items-baseline w-full justify-between'>
                <div className='w-1/3'>
                </div>

                <div className="rounded-lg flex flex-row justify-between py-2 px-3 bg-gray-100 cursor-pointer w-1/3">
                    <div
                        className={'rounded-lg py-2 px-3 flex flex-row items-center justify-center space-x-2 w-1/2' + (tabState == 'my' ? ' bg-white text-black shadow-md' : '')}
                        onClick={() => { setTabState('my') }}>
                        <div className='cursor-pointer'>My Sessions</div>
                    </div>
                    <div
                        className={'rounded-lg py-2 px-3 flex flex-row items-center justify-center space-x-2 w-1/2' + (tabState == 'other' ? ' bg-white text-black shadow-md' : '')}
                        onClick={() => { setTabState('other') }}>
                        <div className='cursor-pointer'>Other Sessions</div>
                    </div>
                </div>

                <div className='cursor-pointer w-1/3 flex flex-row justify-end items-center space-x-2' onClick={() => Meteor.logout()}>
                    <TbLogout />
                    <span>Logout</span>
                </div>
            </div>

            {renderTab()}
        </div>
    )
}  
