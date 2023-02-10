import React, { useState } from "react";
import { PlayerCollection } from '/imports/api/collections.js'

const options = PlayerCollection.find().fetch()

const Autocomplete = () => {
    const [value, setValue] = useState("");
    const [suggestions, setSuggestions] = useState([]);

    const handleChange = event => {
        setValue(event.target.value);
        setSuggestions(
            options.filter(option => option.startsWith(event.target.value))
        );
    };

    const handleClick = option => {
        setValue(option);
        setSuggestions([]);
    };
    
    let compRef = this

    return (
        <div>
            <input className="black-shadow" type="text" value={value}   onChange={handleChange} />
                {suggestions.length > 0 && (
            <ul>
                {suggestions.map(suggestion => (
                    <li key={suggestion} onClick={() => handleClick(suggestion)}>
                        {suggestion}
                    </li>
                ))}
            </ul>
            )}
        </div>
    );
};

export default Autocomplete;