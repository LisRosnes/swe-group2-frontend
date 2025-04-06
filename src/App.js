import React, { useState, useEffect } from 'react';
import './App.css';
import { useNavigate } from 'react-router-dom';
import logo from './logo.svg';

const RAWG_API_KEY = process.env.REACT_APP_RAWG_API_KEY;

const teamsList = [
  { id: 'team-1', name: 'Team Alpha' },
  { id: 'team-2', name: 'Team Beta' },
  { id: 'team-3', name: 'Team Gamma' },
  { id: 'team-4', name: 'Team Delta' },
  { id: 'team-5', name: 'Team Omega' }
];

function App() {
  const [searchType, setSearchType] = useState('game');
  const [searchValue, setSearchValue] = useState('');
  const [randomGames, setRandomGames] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const navigate = useNavigate();

  // Check authentication status on component mount
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const storedUsername = localStorage.getItem('username');

    if (token) {
      setIsLoggedIn(true);
      setUsername(storedUsername || '');
    }
  }, []);

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
    if (searchType === 'game') {
      // Make sure the search value is not empty
      if (!searchValue.trim()) return;
      // Redirect to /search with the query parameter
      navigate(`/search?query=${encodeURIComponent(searchValue.trim())}`);
    } else {
      console.log(`Team search submitted: ${searchValue}`);
      // Add team search logic
    }
  };

  const handleGameInfoClick = () => {
    navigate('/game/the-witcher-3-wild-hunt');
  };

  const handleBuildTeamClick = () => {
    // Redirect to login if not logged in
    if (!isLoggedIn) {
      alert('Please log in to create a team');
      navigate('/login');
      return;
    }
    navigate('/build-team');
  };

  const handleProfileClick = () => {
    navigate('/profile');
  };

  const handleLoginClick = () => {
    navigate('/login');
  };

  const handleLogoutClick = () => {
    // Clear authentication data
    localStorage.removeItem('authToken');
    localStorage.removeItem('userId');
    localStorage.removeItem('username');
    setIsLoggedIn(false);
    setUsername('');
    // Stay on the current page
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

          <button onClick={handleBuildTeamClick} className="build-team-btn">Build Team</button>

          <button onClick={handleGameInfoClick} className="game-info-btn">Game Info</button>

          {isLoggedIn ? (
            <>
              <button onClick={handleProfileClick} className="profile-btn">
                {username}'s Profile
              </button>
              <button onClick={handleLogoutClick} className="logout-btn">Logout</button>
            </>
          ) : (
            <button onClick={handleLoginClick} className="login-btn">Login</button>
          )}
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

      {/* Teams as clickable buttons */}
      <h2>Sample Teams</h2>
      <div className="teams-buttons-container">
        {teamsList.map((team) => (
          <button
            key={team.id}
            className="team-button"
            onClick={() => navigate(`/team/${team.id}`)}
          >
            {team.name}
          </button>
        ))}
      </div>
    </div>
  );
}

export default App;