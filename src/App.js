import React, { useState, useEffect } from 'react';
import './App.css';
import { useNavigate } from 'react-router-dom';
import logo from './logo.svg'; // Placeholder image for both games and teams

const RAWG_API_KEY = process.env.REACT_APP_RAWG_API_KEY;

// Placeholder team data
const sampleTeams = [
  {
    id: 'team-1',
    name: 'Team Alpha',
    host: 'PlayerOne',
    members: ['PlayerTwo', 'PlayerThree'],
    thumbnail: logo, // Fallback to the same logo or any custom image
  },
  {
    id: 'team-2',
    name: 'Team Beta',
    host: 'PlayerX',
    members: ['PlayerY', 'PlayerZ', 'PlayerZZ'],
    thumbnail: logo,
  },
  {
    id: 'team-3',
    name: 'Team Gamma',
    host: 'PlayerM',
    members: ['PlayerN', 'PlayerO'],
    thumbnail: logo,
  },
];

function App() {
  const [searchType, setSearchType] = useState('game');
  const [searchValue, setSearchValue] = useState('');
  const [randomGames, setRandomGames] = useState([]);
  const navigate = useNavigate();

  // Fetch 3 random games from RAWG on mount
  useEffect(() => {
    const randomPage = Math.floor(Math.random() * 100) + 1;
    fetch(`https://api.rawg.io/api/games?key=${RAWG_API_KEY}&page=${randomPage}&page_size=3`)
      .then((res) => res.json())
      .then((data) => {
        if (data.results) {
          setRandomGames(data.results);
        }
      })
      .catch((err) => console.error('Error fetching RAWG data:', err));
  }, []);

  const handleSearchChange = (event) => {
    setSearchValue(event.target.value);
  };

  const handleSearchSubmit = () => {
    console.log(`Search submitted for ${searchType} with query: ${searchValue}`);
    // If game fetch from RAWG
    // If team fetch from your server
  };

  const handleProfileClick = () => {
    navigate('/profile'); // <Route path="/profile" ... /> will be linked with our profile
  };

  const handleLoginClick = () => {
    navigate('/login'); // <Route path="/login" ... /> will be linked with our login page
  };

  return (
    <div className="App">
      {/* Header section with dropdown, search bar, and buttons */}
      <div className="header-bar">
        <div className="search-bar">
          {/* Toggle Game or Team */}
          <select
            value={searchType}
            onChange={(e) => setSearchType(e.target.value)}
          >
            <option value="game">Game</option>
            <option value="team">Team</option>
          </select>

          {/* Text input for the search query */}
          <input
            type="text"
            placeholder={`Search ${searchType}...`}
            value={searchValue}
            onChange={handleSearchChange}
          />

          <button onClick={handleSearchSubmit}>Search</button>
        </div>

        <div className="header-buttons">
          <button onClick={handleProfileClick}>My Profile</button>
          <button onClick={handleLoginClick}>Login</button>
        </div>
      </div>

      {/* Random Games from RAWG */}
      <h2>Random Games from RAWG</h2>
      <div className="cards-container">
        {randomGames.map((game) => (
          <div className="card" key={game.id}>
            <img
              src={game.background_image || logo}
              alt={game.name}
              style={{ width: '100%' }}
            />
            <h3>{game.name}</h3>
            <p>Released: {game.released || 'N/A'}</p>
          </div>
        ))}
      </div>

      {/* Teams (Placeholder data) */}
      <h2>Placeholder Team Cards</h2>
      <div className="cards-container">
        {sampleTeams.map((team) => (
          <div className="card" key={team.id}>
            <img
              src={team.thumbnail}
              alt={team.name}
              style={{ width: '100%' }}
            />
            <h3>{team.name}</h3>
            <p>Host: {team.host}</p>
            <p>Members: {team.members.join(', ')}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;