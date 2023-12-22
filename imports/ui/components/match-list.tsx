import React, { useState } from 'react'
import { useTracker } from 'meteor/react-meteor-data'
import { MatchCollection } from '/imports/api/collections.ts'
import { BiCheck, BiEdit, BiX, BiPlus, BiPlusCircle, BiSearch, BiTrash } from 'react-icons/bi'

export type MatchListProps = {
    sessionId: string;
    ownerLoggedIn: boolean;
}

export const MatchList: React.FC<MatchListProps> = (props: MatchListProps) => {
    const [searchedName, setSearchedName] = useState('');
    const [addMatchState, setAddMatchState] = useState(false);
    const [hoveredMatch, setHoveredMatch] = useState('');
    const [matchToEdit, setMatchToEdit] = useState('');

    const allMatches = useTracker(() => MatchCollection.find({ sessionId: props.sessionId }).fetch() as MatchType[]);
    const nameIncludes = (str1: string, str2: string) => str1.toLowerCase().includes(str2.toLowerCase());
    const searchedMatches = allMatches.filter(match =>
        nameIncludes(match.p1, searchedName) || nameIncludes(match.p2, searchedName)
    );

    const sortFn = (m1: MatchType, m2: MatchType) => {
        return new Date(m1.date).getTime() - new Date(m2.date).getTime();
    }
    searchedMatches.sort(sortFn);

    const renderMatches = () => {
        if (searchedMatches.length == 0) {
            return <></>
        }

        const dateToString = (date: any) => {
            return new Date(date).toLocaleString('en-US', { dateStyle: 'medium' })
        }

        const matchesByDate = [];
        const dates = [];
        let currDate = dateToString(searchedMatches[0].date)
        let start = 0;
        while (start < searchedMatches.length) {
            dates.push(currDate);

            let end = start;
            while (end < searchedMatches.length && dateToString(searchedMatches[end].date) == currDate) {
                end++;
            }

            matchesByDate.push(searchedMatches.slice(start, end))
            if (end < searchedMatches.length) {
                currDate = dateToString(searchedMatches[end].date)
            }
            start = end;
        }

        const matchContent = [];
        for (let i = 0; i < dates.length; i++) {
            const mapMatch = (match: MatchType) => {
                if (match._id == matchToEdit) {
                    const handleEditMatch = () => {
                        let p1 = (document.getElementById('p1-edit') as HTMLInputElement).value;
                        let p2 = (document.getElementById('p2-edit') as HTMLInputElement).value;
                        const s1 = [(document.getElementById('s11-edit') as HTMLInputElement).value,
                        (document.getElementById('s12-edit') as HTMLInputElement).value,
                        (document.getElementById('s13-edit') as HTMLInputElement).value];
                        const s2 = [(document.getElementById('s21-edit') as HTMLInputElement).value,
                        (document.getElementById('s22-edit') as HTMLInputElement).value,
                        (document.getElementById('s23-edit') as HTMLInputElement).value];
                        if (!p1 || !p2 || !s1 || !s2) {
                            return;
                        }

                        const editedMatch = {
                            p1: p1,
                            p2: p2,
                            s1: s1,
                            s2: s2,
                            date: new Date(match.date),
                            sessionId: props.sessionId
                        };

                        MatchCollection.update({ _id: match._id }, editedMatch);
                        setMatchToEdit('');
                    }
                    return (
                        <div className='rounded-lg bg-gray-100'>
                            <div className='flex flex-row border-b border-gray-200'>
                                <div className='w-7/12 border-r border-gray-200'>
                                    <input id='p1-edit' className='p-4 border-r border-gray-200 bg-gray-100 rounded-lg' defaultValue={match.p1} />
                                </div>
                                <div className='border-r border-gray-200 w-1/12 flex justify-center items-center'>
                                    <input id='s11-edit' className='bg-gray-100 w-3 text-center' defaultValue={match.s1[0]} />
                                </div>
                                <div className='border-r border-gray-200 w-1/12 flex justify-center items-center'>
                                    <input id='s12-edit' className='bg-gray-100 w-3 text-center' defaultValue={match.s1[1]} />
                                </div>
                                <div className='border-r border-gray-200 w-1/12 flex justify-center items-center'>
                                    <input id='s13-edit' className='bg-gray-100 w-3 text-center' defaultValue={match.s1[2]} />
                                </div>
                                <button className='rounded-lg p-4 w-2/12 flex justify-center items-center' onClick={() => handleEditMatch()}>
                                    <BiCheck className='text-xl text-gray-400 hover:text-green-500 transition-colors' />
                                </button>
                            </div>
                            <div className='flex flex-row'>
                                <div className='w-7/12 border-r border-gray-200'>
                                    <input id='p2-edit' className='rounded-lg p-4 bg-gray-100' defaultValue={match.p2} />
                                </div>
                                <div className='border-r border-gray-200 w-1/12 flex justify-center items-center'>
                                    <input id='s21-edit' className='bg-gray-100 w-3 text-center' defaultValue={match.s2[0]} />
                                </div>
                                <div className='border-r border-gray-200 w-1/12 flex justify-center items-center'>
                                    <input id='s22-edit' className='bg-gray-100 w-3 text-center' defaultValue={match.s2[1]} />
                                </div>
                                <div className='border-r border-gray-200 w-1/12 flex justify-center items-center'>
                                    <input id='s23-edit' className='bg-gray-100 w-3 text-center' defaultValue={match.s2[2]} />
                                </div>
                                <button className='rounded-lg p-4 w-2/12 flex justify-center items-center' onClick={() => setMatchToEdit('')}>
                                    <BiX className='text-xl text-gray-400 hover:text-red-500 transition-colors' />
                                </button>
                            </div>
                        </div>
                    )
                } else if (match._id == hoveredMatch && props.ownerLoggedIn) {
                    const handleDeleteMatch = () => MatchCollection.remove({ _id: match._id })
                    return (
                        <div className='rounded-lg hover:bg-gray-200 transition-colors flex flex-row justify-center items-center space-x-4' onMouseLeave={() => setHoveredMatch('')}>
                            <button className='rounded-lg p-4' onClick={() => setMatchToEdit(match._id)}>
                                <BiEdit className='text-gray-400 hover:text-black transition-colors text-2xl' />
                            </button>
                            <button className='rounded-lg p-4' onClick={handleDeleteMatch}>
                                <BiTrash className=' text-gray-400 hover:text-red-500 transition-colors text-2xl' />
                            </button>
                        </div>
                    );
                } else {
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
                }
            }
            matchContent.push(
                <div className='w-full space-y-5'>
                    <div className='text-center text-gray-400'>
                        {dates[i]}
                    </div>

                    <div className='grid grid-cols-3 gap-4'>
                        {matchesByDate[i].map(mapMatch)}
                    </div>
                </div>
            );
        }

        return matchContent;
    }


    const addMatchTile = () => {
        const handleAddMatch = () => {
            let p1 = (document.getElementById('p1') as HTMLInputElement).value
            let p2 = (document.getElementById('p2') as HTMLInputElement).value
            const s1 = [
                (document.getElementById('s11') as HTMLInputElement).value,
                (document.getElementById('s12') as HTMLInputElement).value,
                (document.getElementById('s13') as HTMLInputElement).value
            ]
            const s2 = [
                (document.getElementById('s21') as HTMLInputElement).value,
                (document.getElementById('s22') as HTMLInputElement).value,
                (document.getElementById('s23') as HTMLInputElement).value
            ]

            if (!p1 || !p2 || !s1 || !s2) {
                return
            }

            const new_rec = {
                p1: p1,
                p2: p2,
                s1: s1,
                s2: s2,
                date: new Date(),
                sessionId: props.sessionId
            }

            MatchCollection.insert(new_rec)
            setAddMatchState(false)
        }

        if (addMatchState) {
            return (
                <div className='grid grid-cols-3 gap-4'>
                    <div className='rounded-lg bg-gray-100'>
                        <div className='flex flex-row border-b border-gray-200'>
                            <div className='w-7/12 border-r border-gray-200'>
                                <input id='p1' className='p-4 border-r border-gray-200 bg-gray-100 rounded-lg' placeholder='Player name' />
                            </div>
                            <div className='border-r border-gray-200 w-1/12 flex justify-center items-center'>
                                <input id='s11' className='bg-gray-100 w-3 text-center' />
                            </div>
                            <div className='border-r border-gray-200 w-1/12 flex justify-center items-center'>
                                <input id='s12' className='bg-gray-100 w-3 text-center' />
                            </div>
                            <div className='border-r border-gray-200 w-1/12 flex justify-center items-center'>
                                <input id='s13' className='bg-gray-100 w-3 text-center' />
                            </div>
                            <button className='rounded-lg p-4 w-2/12 flex justify-center items-center' onClick={() => handleAddMatch()}>
                                <BiPlus className='text-xl text-gray-400 hover:text-green-500 transition-colors' />
                            </button>
                        </div>
                        <div className='flex flex-row'>
                            <div className='w-7/12 border-r border-gray-200'>
                                <input id='p2' className='rounded-lg p-4 bg-gray-100' placeholder='Player name' />
                            </div>
                            <div className='border-r border-gray-200 w-1/12 flex justify-center items-center'>
                                <input id='s21' className='bg-gray-100 w-3 text-center' />
                            </div>
                            <div className='border-r border-gray-200 w-1/12 flex justify-center items-center'>
                                <input id='s22' className='bg-gray-100 w-3 text-center' />
                            </div>
                            <div className='border-r border-gray-200 w-1/12 flex justify-center items-center'>
                                <input id='s23' className='bg-gray-100 w-3 text-center' />
                            </div>
                            <button className='rounded-lg p-4 w-2/12 flex justify-center items-center' onClick={() => setAddMatchState(false)}>
                                <BiX className='text-xl text-gray-400 hover:text-red-500 transition-colors' />
                            </button>
                        </div>
                    </div>
                </div>
            )
        } else {
            return (
                <div className='grid grid-cols-3 gap-4 h-28'>
                    <div className='rounded-lg border-dotted border-2 border-gray-200 hover:border-black flex items-center justify-center cursor-pointer text-3xl text-gray-300 hover:text-black transition-colors'
                        style={{ height: '' }} onClick={() => setAddMatchState(true)}>
                        <BiPlusCircle className='text' />
                    </div>
                </div>
            )
        }
    }

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchedName(e.target.value)
    }

    return (
        <div className='flex flex-col space-y-8'>
            <div className='flex flex-row justify-start items-center bg-gray-100 rounded-lg px-4 py-3 space-x-2 text-gray-400 w-72'>
                <BiSearch />
                <input className='bg-gray-100 text-gray-700' onChange={handleSearch} placeholder="Search for player" />
            </div>

            {props.ownerLoggedIn && addMatchTile()}

            {renderMatches()}
        </div>
    )
}
