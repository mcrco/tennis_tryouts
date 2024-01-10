import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data'
import React, { useState } from 'react';
import { SessionCollection, MatchCollection } from '../api/collections';
import { ErrorModal } from './components/modal';
import { SessionFinder } from './session-finder';
import { TbLogout } from 'react-icons/tb';
import { BiPlusCircle, BiTrash } from 'react-icons/bi';

type DashboardPropsType = {
    setSessionCode: (sessionCode: string) => void;
}

// Dashboard that displays all sessions managed by coach
export const Dashboard = (props: DashboardPropsType) => {
    const userId = useTracker(() => Meteor.userId());
    if (userId == null) {
        return <></>;
    }

    Meteor.subscribe('allSessions');
    const sessions = useTracker(() => SessionCollection.find().fetch());
    const userSessions = sessions.filter(session => session.owner == userId);

    const [isAddingSession, setIsAddingSession] = useState(false);
    const [addSessionError, setAddSessionError] = useState(false);
    const [tabState, setTabState] = useState('my');

    const deleteSession = (sessionId: string) => SessionCollection.removeAsync({ _id: sessionId });

    const sessionTiles = userSessions.map((session) => {
        const numMatches = MatchCollection.find({ sessionId: session._id }).count()
        return (
            <div className='rounded-lg bg-gray-100 h-auto flex flex-col hover:shadow-lg transition-all cursor-pointer group border border-gray-200' onClick={() => props.setSessionCode(session.code)}>
                <div className='text-lg px-5 pt-4 pb-2 font-extrabold mb-3 border-b border-gray-200 flex flex-row justify-between items-center'>
                    <span>{session.name}</span>
                    <div className='invisible group-hover:visible hover:text-red-500' onClick={e => { e.stopPropagation(); deleteSession(session._id) }}>
                        <BiTrash />
                    </div>
                </div>
                <div className='px-5 pt-2 pb-4'>
                    <p>
                        Share Code: {session.code}
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
            const sessionName = (document.getElementById('session-name-input') as HTMLInputElement).value;
            const viewCode = (document.getElementById('view-code-input') as HTMLInputElement).value;
            if (sessions.filter(session => session.code == viewCode).length != 0) {
                setAddSessionError(true);
                return;
            }

            Meteor.call('insertSession', {
                name: sessionName,
                code: viewCode,
                created: new Date(),
                owner: userId
            });
            setIsAddingSession(false);
        };

        const handleCancelAddSession = () => {
            setIsAddingSession(false)
        };

        sessionTiles.push(
            <div className='rounded-lg p-5 bg-gray-100 shadow-md h-auto flex flex-col space-y-2'>
                <div className='flex flex-row space-x-2'>
                    <input id='session-name-input' className='rounded-lg p-2 pl-3 bg-white w-3/4' placeholder='Session name' />
                    <button className='rounded-lg w-1/4 flex justify-center items-center bg-green-200 border border-transparent text-green-500 font-bold hover:shadow-md hover:border-green-400 transition-all'
                        onClick={() => handleAddSession()}>
                        Add
                    </button>
                </div>
                <div className='flex flex-row space-x-2'>
                    <input id='view-code-input' className='rounded-lg p-2 pl-3 bg-white w-3/4' placeholder='View code' />
                    <button className='rounded-lg w-1/4 flex justify-center items-center bg-red-200 border border-transparent text-red-500 font-bold hover:shadow-md hover:border-red-400 transition-all'
                        onClick={() => handleCancelAddSession()}>
                        Cancel
                    </button>
                </div>
            </div>
        );
    } else {
        sessionTiles.push(
            <div className='rounded-lg border-dotted border-2 h-auto flex items-center justify-center transition-colors cursor-pointer text-gray-200 text-3xl hover:text-black hover:border-black min-h-40'
                onClick={() => setIsAddingSession(true)}>
                <BiPlusCircle /> <span className='text-xl'> &nbsp; Add Session</span>
            </div>
        )
    }

    const renderTab = () => {
        if (tabState == 'my') {
            return (
                <div>
                    <div className='grid grid-cols-3 gap-8 min-h-40'>
                        {sessionTiles}
                    </div>
                    <ErrorModal visible={addSessionError} header={'Error'} body={'Session view code already in use. Please try another.'} toggleVisible={() => setAddSessionError(false)} />
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

                <div className='w-1/3 flex flex-row justify-end items-center space-x-2'>
                    <TbLogout className='cursor-pointer' onClick={() => Meteor.logout()} />
                    <span className='cursor-pointer' onClick={() => Meteor.logout()}>Logout</span>
                </div>
            </div>

            {renderTab()}
        </div>
    )
}  
