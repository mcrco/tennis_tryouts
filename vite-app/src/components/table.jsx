import React from 'react'
import { useState } from 'react'
import recordsJson from '../assets/records.json'
import {jsonfile} from 'jsonfile'

export default function RecordsTable() {
    
    const [records, setRecords] = useState(recordsJson)

    const tableRows = records.map(
        (record) => (
            (<tr>
                <td> {record.p1} </td>
                <td> {record.p2} </td>
                <td> {record.s1} </td>
                <td> {record.s2} </td>
            </tr>)
        )
    )
    
    const handleAddMatch = () => {
        const p1 = document.getElementById('p1').value
        const p2 = document.getElementById('p2').value
        const s1 = document.getElementById('s1').value
        const s2 = document.getElementById('s2').value
        
        const new_rec = {
            p1: p1,
            p2: p2,
            s1: s1,
            s2: s2
        }
        
        const new_records = records.concat(new_rec)
        /*
        jsonfile.write('../assets/records.json', new_records, (err) => {
            if (err) console.log(err)
        })
        */
        setRecords(new_records)
    }

    return (
        <div className='rounded'>
            <div className='row'>
                <input className='row-element' type='text' id='p1' name='p1-input' placeholder='Player 1 Name'  />
                <input className='row-element' type='text' id='p2' name='p2-input' placeholder='Player 2 Name' />
                <input className='row-element' type='text' id='s1' name='s1-input' placeholder='Player 1 Score'/>
                <input className='row-element' type='text' id='s2' name='s2-input' placeholder='Player 2 Score'/>
                <button className='row-element' onClick={handleAddMatch}>Add Match</button>
            </div>
        
            <div style={{height: '20px'}}></div>

            <table className="styled-table">
                <thead>
                    <tr>
                        <th>Player 1</th>
                        <th>Player 2</th>
                        <th>Score 1</th>
                        <th>Score 2</th>
                    </tr>
                </thead>
                <tbody>
                    {tableRows}
                </tbody>
            </table>
        </div>
    )
}