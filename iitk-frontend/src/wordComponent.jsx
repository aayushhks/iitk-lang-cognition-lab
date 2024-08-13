import React, { useState, useEffect } from 'react';
import axios from 'axios';

const WordComponent = () => {
    const [words, setWords] = useState([]);
    const [lastUsedIdx, setLastUsedIdx] = useState(0);
    const [sliceOfN, setSliceOfN] = useState(10); // Number of words to fetch in one go
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchWords();
    }, []); // Empty dependency array ensures it runs only on component mount

    const fetchWords = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await axios.post('http://localhost:4997/words', {
                slice_of_n: sliceOfN,
                offset_idx: lastUsedIdx,
                email: 'neha_pendse@gmail.com', // Replace with actual email
                course: 'New Imageability' // Replace with actual course
            });
            const [totalWords, newLastUsedIdx, newWords] = response.data;
            setWords(prevWords => [...prevWords, ...newWords]);
            setLastUsedIdx(newLastUsedIdx);
        } catch (error) {
            console.error('Error fetching words:', error);
            setError('Failed to load words.');
        } finally {
            setLoading(false);
        }
    };

    const handleNextButtonClick = () => {
        fetchWords();
    };

    return (
        <div>
            {loading && <p>Loading...</p>}
            {error && <p>{error}</p>}
            <ul>
                {words.map((word, index) => (
                    <li key={index}>{word}</li>
                ))}
            </ul>
            <button onClick={handleNextButtonClick} disabled={loading}>
                Next
            </button>
        </div>
    );
};

export default WordComponent;
