import React, { useState } from 'react'
import { useTracker } from 'meteor/react-meteor-data'
import { MatchCollection } from '/imports/api/collections.js'
import PlayerUtil from '../../util/player-util'
import { BiSearch } from 'react-icons/bi'
import { FaSortNumericDown, FaSortNumericDownAlt } from 'react-icons/fa'

export default function Leaderboard(props) {

    const [searchedName, setSearchedName] = useState("")
    const [sortOption, setSortOption] = useState('rank')
    const [sortRankReverse, setSortRankReverse] = useState(false)
    const [sortWinsReverse, setSortWinsReverse] = useState(false)
    const [sortLossesReverse, setSortLossesReverse] = useState(false)

    const matches = useTracker(() => MatchCollection.find({ sessionId: props.sessionId }).fetch())
    const playerUtil = new PlayerUtil(matches)
    let players = []
    for (const match of matches) {
        if (!players.includes(match.p1)) {
            players.push(match.p1)
        }
        if (!players.includes(match.p2)) {
            players.push(match.p2)
        }
    }

    const playersRanked = [...players];
    playersRanked.sort((p1, p2) => playerUtil.bfsCompare(p1, p2));
    const ranks = [1];
    let currRank = 1;
    let currIndex = 1;
    while (currIndex < playersRanked.length) {
        while (currIndex < playersRanked.length && playerUtil.bfsCompare(playersRanked[currIndex], playersRanked[currIndex - 1]) == 0) {
            ranks.push(currRank);
            currIndex++;
        }

        console.log(currIndex);

        if (currIndex < players.length) {
            currRank++;
            ranks.push(currRank);
            currIndex++;
        }
    }

    const sortFn = (p1, p2) => {
        if (sortOption == 'rank') {
            return (sortRankReverse ? -1 : 1) * playerUtil.bfsCompare(p1, p2);
        } else if (sortOption == 'wins') {
            return (sortWinsReverse ? -1 : 1) * (playerUtil.getNumWins(p1) - playerUtil.getNumWins(p2));
        } else if (sortOption == 'losses') {
            return (sortLossesReverse ? -1 : 1) * (playerUtil.getNumLosses(p1) - playerUtil.getNumLosses(p2));
        }
    };
    players.sort(sortFn);

    const handleSearch = (event) => {
        setSearchedName(event.target.value)
    }

    const handleClickRank = () => {
        if (sortOption == 'rank') {
            setSortRankReverse(!sortRankReverse)
        }
        setSortOption('rank')
    }

    const handleClickWins = () => {
        if (sortOption == 'wins') {
            setSortWinsReverse(!sortWinsReverse)
        }
        setSortOption('wins')
    }

    const handleClickLosses = () => {
        if (sortOption == 'losses') {
            setSortLossesReverse(!sortLossesReverse)
        }
        setSortOption('losses')
    }

    const tableBody = players.map((player) => {
        const wins = playerUtil.getNumWins(player);
        const losses = playerUtil.getNumLosses(player);
        const rank = ranks[playersRanked.indexOf(player)];

        if (!player.includes(searchedName.toLowerCase()))
            return;

        return (
            <tr className='border-b border-gray-200'>
                <td className='px-5 py-4'>{player}</td>
                <td className='px-5 py-4'>{wins}</td>
                <td className='px-5 py-4'>{losses}</td>
                <td className='px-5 py-4'>{rank}</td>
            </tr>
        );
    });

    return (
        <div className='flex flex-col space-y-8'>
            <div className='flex flex-row justify-start items-center bg-gray-100 rounded-lg px-4 py-3 space-x-2 text-gray-400 w-72'>
                <BiSearch />
                <input className='bg-gray-100 text-gray-700' onChange={handleSearch} placeholder="Search for player" />
            </div>

            <table className='table-fixed w-full bg-gray-100 rounded-lg'>
                <thead>
                    <tr className='border-b border-gray-200'>
                        <th className='px-5 py-4 text-left w-1/2'>Player</th>
                        <th className='px-5 py-4 text-left w-1/6' onClick={() => handleClickWins()}>
                            <div className='flex flex-row items-center space-x-2'>
                                <div> Wins </div>
                                {sortOption == 'wins' && (sortWinsReverse ? <FaSortNumericDownAlt /> : <FaSortNumericDown />)}
                            </div>
                        </th>
                        <th className='px-5 py-4 text-left w-1/6' onClick={() => handleClickLosses()}>
                            <div className='flex flex-row items-center space-x-2'>
                                <div> Losses </div>
                                {sortOption == 'losses' && (sortLossesReverse ? <FaSortNumericDown /> : <FaSortNumericDownAlt />)}
                            </div>
                        </th>
                        <th className='px-5 py-4 text-left w-1/6' onClick={() => handleClickRank()}>
                            <div className='flex flex-row items-center space-x-2'>
                                <div> Rank </div>
                                {sortOption == 'rank' && (sortRankReverse ? <FaSortNumericDownAlt /> : <FaSortNumericDown />)}
                            </div>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {tableBody}
                </tbody>
            </table>
        </div>
    )
}
