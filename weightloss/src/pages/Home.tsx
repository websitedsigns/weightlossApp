import React, { useEffect, useState} from 'react';

const Home: React.FC = () => {
    const [weights, setWeights] = useState<number[]>([]);
    const [input, setInput] = useState<string>('');

    useEffect (() => {
        const stored = localStorage.getItem('weights');
        if (stored) setWeights(JSON.parse(stored));
     }, []);

    useEffect(() => {
        localStorage.setItem('weights', JSON.stringify(weights));
    }, [weights]);
    
    const handleAdd = () => {
        if (!input) return;
        setWeights([...weights, parseFloat(input)]);
        setInput('');
    };

    return (
        <div>
            <h1>Weight Tracker</h1>
            <input 
                type="number"
                placeholder="Enter weight"
                value={input}
                onChange={(e) => setInput(e.target.value)}
            />
        <button onClick={handleAdd}>Add</button>
            <h2>Recorded Weights</h2>
            <ul>
                {weights.map((w, i) => (
                    <li key={i}>{w} kg</li>
                ))}
            </ul>

        </div>

    );
};

export default Home;