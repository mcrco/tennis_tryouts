import React, { useState } from 'react'
import { useTracker } from 'meteor/react-meteor-data'
import { MatchCollection } from '/imports/api/collections.js'
import PlayerUtil from '../../util/player-util'
import { IoPersonOutline } from 'react-icons/io5';
import { FaRegUser } from 'react-icons/fa';
import { BiSearch, BiUser } from 'react-icons/bi';

export default function Compare(props) {

    const [p1, setP1] = useState('!');
    const [p2, setP2] = useState('!');

    const matches = useTracker(() => MatchCollection.find({ sessionId: props.sessionId }).fetch());
    const playerUtil = new PlayerUtil(matches);

    let recordStatement = ''
    let comparison = <></>

    if (playerUtil.hasPlayer(p1) && playerUtil.hasPlayer(p2)) {
        recordStatement = (<span> {p1}'s record is {playerUtil.getNumWins(p1)}-{playerUtil.getNumLosses(p1)}. {p2}'s record is {playerUtil.getNumWins(p2)}-{playerUtil.getNumLosses(p2)}. </span>);

        const h2hToMatches = (p1, p2, h2h) => {
            const relevantMatches = matches.filter((match) => (match.p1 == p1 && match.p2 == p2) || (match.p1 == p2 && match.p2 == p1));
            const mapMatch = (match) => {
                let wins = 0;
                let losses = 0;
                for (let i of [0, 1, 2]) {
                    if (match.s1[i] > match.s2[i])
                        wins++;
                    else if (match.s1[i] < match.s2[i])
                        losses++;
                }
                const p1Win = wins > losses;
                return (
                    <div className='rounded-lg bg-gray-100' onMouseEnter={() => setHoveredMatch(match._id)}>
                        <div className='flex flex-row border-b border-gray-200'>
                            <div className={'p-4 w-5/8 border-r border-gray-200 ' + (p1Win ? 'font-semibold' : '')}> {match.p1} </div>
                            <div className={'py-4 w-1/8 border-r border-gray-200 text-center ' + (match.s1[0] > match.s2[0] ? 'font-semibold' : '')}> {match.s1[0]} </div>
                            <div className={'py-4 w-1/8 border-r border-gray-200 text-center ' + (match.s1[1] > match.s2[1] ? 'font-semibold' : '')}> {match.s1[1]} </div>
                            <div className={'py-4 w-1/8 text-center ' + (match.s1[2] > match.s2[2] ? 'font-semibold' : '')}> {match.s1[2]} </div>
                        </div>
                        <div className='flex flex-row'>
                            <div className={'p-4 w-5/8 border-r border-gray-200 ' + (!p1Win ? 'font-semibold' : '')}> {match.p2} </div>
                            <div className={'py-4 w-1/8 border-r border-gray-200 text-center ' + (match.s1[0] < match.s2[0] ? 'font-semibold' : '')}> {match.s2[0]} </div>
                            <div className={'py-4 w-1/8 border-r border-gray-200 text-center ' + (match.s1[1] < match.s2[1] ? 'font-semibold' : '')}> {match.s2[1]} </div>
                            <div className={'py-4 w-1/8 text-center ' + (match.s1[2] < match.s2[2] ? 'font-semibold' : '')}> {match.s2[2]} </div>
                        </div>
                    </div>
                )
            };
            return (
                <div className='flex flex-col space-y-8'>
                    <span>{p1}'s has {h2h[0]} win(s) and {h2h[1]} loss(es) against {p2}. The relevant matches are listed below.</span>
                    <div className='grid grid-cols-3 gap-4'>
                        {relevantMatches.map(mapMatch)}
                    </div>
                </div>
            );
        };

        const h2h = playerUtil.getH2H(p1, p2)
        if (h2h[0] != 0 || h2h[1] != 0) {
            comparison = h2hToMatches(p1, p2, h2h);
        } else {
            const p1WinChain = playerUtil.getWinChain(p1, p2);
            const p2WinChain = playerUtil.getWinChain(p2, p1);

            if (p1WinChain.length != 0 && p2WinChain.length != 0) {
                const chain = p1WinChain.concat(p2WinChain.slice(1, p2WinChain.length));
                let summary = p1 + ' and ' + p2 + ', along with ' + chain.slice().toString() + ' are in a rock paper scissors stalemate! ';
                for (let i = 0; i < chain.length - 1; i++) {
                    summary += chain[i] + ' has a positive record against ' + chain[i + 1] + '. ';
                }

                const h2hs = [];
                for (let i = 0; i < chain.length - 1; i++) {
                    h2hs.push(h2hToMatches(chain[i], chain[i + 1], playerUtil.getH2H(p1, p2)))
                }

                comparison = (
                    <div className='flex flex-col space-y-8'>
                        <span> {summary} </span>
                        {h2hs}
                    </div>
                )
            } else if (p1WinChain.length != 0) {
                let summary = ''
                for (let i = 0; i < p1WinChain.length - 1; i++) {
                    summary += p1WinChain[i] + ' has a positive record against ' + p1WinChain[i + 1] + '. ';
                }

                const h2hs = [];
                for (let i = 0; i < p1WinChain.length - 1; i++) {
                    h2hs.push(h2hToMatches(p1WinChain[i], p1WinChain[i + 1], playerUtil.getH2H(p1WinChain[i], p1WinChain[i + 1])))
                }

                comparison = (
                    <div className='flex flex-col space-y-8'>
                        <span> {summary} </span>
                        {h2hs}
                    </div>
                )
            } else if (p2WinChain.length != 0) {
                let summary = ''
                for (let i = 0; i < p2WinChain.length - 1; i++) {
                    summary += p2WinChain[i] + ' has a positive record against ' + p2WinChain[i + 1] + '. ';
                }

                const h2hs = [];
                for (let i = 0; i < p2WinChain.length - 1; i++) {
                    h2hs.push(h2hToMatches(p2WinChain[i], p2WinChain[i + 1], playerUtil.getH2H(p2WinChain[i], p2WinChain[i + 1])))
                }

                comparison = (
                    <div className='flex flex-col space-y-8'>
                        <span> {summary} </span>
                        {h2hs}
                    </div>
                )
            }
        }
    }

    return (
        <div className='flex flex-col space-y-8'>
            <div className='flex flex-row justify-start items-center rounded-lg space-x-4'>
                <div className='flex flex-row justify-start items-center rounded-lg text-gray-400 bg-gray-100 space-x-2 px-4 py-3 w-72'>
                    <BiSearch />
                    <input className='bg-gray-100 rounded-lg text-gray-700' id='p1' name='p1-input' placeholder='Player Name' onChange={(e) => setP1(e.target.value)} />
                </div>
                <span> vs </span>
                <div className='flex flex-row justify-start items-center rounded-lg text-gray-400 bg-gray-100 space-x-2 px-4 py-3 w-72'>
                    <BiSearch />
                    <input className='bg-gray-100 rounded-lg text-gray-700' id='p2' name='p2-input' placeholder='Player Name' onChange={(e) => setP2(e.target.value)} />
                </div>
            </div>

            {recordStatement}

            {comparison}
        </div>
    )
}
