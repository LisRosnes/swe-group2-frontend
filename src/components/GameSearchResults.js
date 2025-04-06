import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const RAWG_API_KEY = process.env.REACT_APP_RAWG_API_KEY;

const GameSearchResults = () => {
    const [results, setResults] = useState([]);
    const location = useLocation();
    const navigate = useNavigate();

    // Parse the query from the URL
    const queryParams = new URLSearchParams(location.search);
    const query = queryParams.get('query') || '';

    useEffect(() => {
        if (query) {
            fetch(`https://api.rawg.io/api/games?key=${RAWG_API_KEY}&search=${encodeURIComponent(query)}&page_size=10`)
                .then((res) => res.json())
                .then((data) => {
                    if (data.results) {
                        setResults(data.results);
                    }
                })
                .catch((err) => console.error('Error fetching search results:', err));
        }
    }, [query]);

    const handleGameClick = (gameId) => {
        // Navigate to the Game Info page for the selected game
        navigate(`/game/${gameId}`);
    };

    return (
        <div className="game-search-results">
            <h1>Search Results for: "{query}"</h1>
            {results.length === 0 ? (
                <p>No results found.</p>
            ) : (
                <ul>
                    {results.map((game) => (
                        <li key={game.id} onClick={() => handleGameClick(game.id)}>
                            {game.name}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default GameSearchResults;