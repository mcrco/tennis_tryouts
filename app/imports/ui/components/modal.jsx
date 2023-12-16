import React, { useState } from 'react';
import { IoWarningOutline } from 'react-icons/io5';

export const Modal = (props) => {
    return (
        <div className={'fixed w-screen h-screen flex justify-center items-center top-0 left-0 bg-white/50 backdrop-blur-sm' + (props.visible ? ' visible' : ' invisible')}>
            <div className={'bg-gray-100 w-96 h-52 flex flex-col justify-between items-center space-y-4 p-8 rounded-lg'}>
                <IoWarningOutline className='text-red-500 text-8xl' />
                <div className=''>
                    <span className='font-bold'> {props.header}: </span>
                    {props.body}
                </div>
                <button className='bg-red-500 px-4 py-2 w-36 rounded-lg text-white' onClick={props.toggleVisible}>
                    Dismiss
                </button>
            </div>
        </div>
    )
}