import { Meteor } from 'meteor/meteor'
import React, { ReactNode, useState } from 'react'
import { useTracker } from 'meteor/react-meteor-data'
import { MatchCollection } from '/imports/api/collections.ts'
import CompUtil from '../../util/comp-util'
import { BiSearch } from 'react-icons/bi'
import { FaSortNumericDown, FaSortNumericDownAlt } from 'react-icons/fa'

export type LeaderboardProps = {
    sessionId: string;
}

export const Leaderboard = (props: LeaderboardProps) => {

    const [searchedName, setSearchedName] = useState("")
    const [sortOption, setSortOption] = useState('rank')
    const [sortRankReverse, setSortRankReverse] = useState(false)
    const [sortWinsReverse, setSortWinsReverse] = useState(false)
    const [sortLossesReverse, setSortLossesReverse] = useState(false)

    Meteor.subscribe('allMatches');
    const matches = useTracker(() => MatchCollection.find({ sessionId: props.sessionId }).fetch() as MatchType[])
    const compUtil = new CompUtil(matches)
    let players: string[] = []
    for (const match of matches) {
        if (!players.includes(match.p1)) {
            players.push(match.p1)
        }
        if (!players.includes(match.p2)) {
            players.push(match.p2)
        }
    }

    const playersRanked = [...players];
    playersRanked.sort((p1, p2) => compUtil.compare(p1, p2));
    const ranks = [1];
    let currRank = 1;
    let currIndex = 1;
    while (currIndex < playersRanked.length) {
        while (currIndex < playersRanked.length && compUtil.compare(playersRanked[currIndex], playersRanked[currIndex - 1]) == 0) {
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

    const sortFn = (p1: string, p2: string) => {
        if (sortOption == 'rank') {
            return (sortRankReverse ? -1 : 1) * compUtil.compare(p1, p2);
        } else if (sortOption == 'wins') {
            return (sortWinsReverse ? -1 : 1) * (compUtil.getNumWins(p1) - compUtil.getNumWins(p2));
        } else if (sortOption == 'losses') {
            return (sortLossesReverse ? -1 : 1) * (compUtil.getNumLosses(p1) - compUtil.getNumLosses(p2));
        }
        return 0;
    };
    players.sort(sortFn);

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchedName(e.target.value)
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

    let tableBody: Array<ReactNode> = [];
    for (let i = 0; i < players.length; i++) {
        const player = players[i];
        const wins = compUtil.getNumWins(player);
        const losses = compUtil.getNumLosses(player);
        const rank = ranks[playersRanked.indexOf(player)];

        if (!player.includes(searchedName.toLowerCase()))
            return;

        tableBody.push(
            <tr className={i != players.length - 1 ? 'border-b border-gray-200' : ''}>
                <td className='px-5 py-4'>{player}</td>
                <td className='px-5 py-4'>{wins}</td>
                <td className='px-5 py-4'>{losses}</td>
                <td className='px-5 py-4'>{rank}</td>
            </tr>
        );

    }

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
