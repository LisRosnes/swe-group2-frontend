import React, { useState, useEffect } from 'react';
import './App.css';
import { Link, useNavigate } from 'react-router-dom';
import logo from './logo.svg';

const RAWG_API_KEY = process.env.REACT_APP_RAWG_API_KEY;

function App() {
  const [searchType, setSearchType] = useState('game');
  const [searchValue, setSearchValue] = useState('');
  const [randomGames, setRandomGames] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const navigate = useNavigate();
  const [searchResults, setSearchResults] = useState(null);
  const [teamSearchMessage, setTeamSearchMessage] = useState('');

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
      // Dummy data for matching games
      const dummyGameResults = [
        {
          id: 'game-101',
          name: 'Matching Game 1',
          released: '2023-01-01',
          background_image: 'https://github.com/mu-xiaofan/Icy/blob/main/icy.png',
        },
        {
          id: 'game-102',
          name: 'Matching Game 2',
          released: '2023-02-01',
          background_image: 'https://github.com/mu-xiaofan/Icy/blob/main/icy.png',
        },
        {
          id: 'game-103',
          name: 'Matching Game 3',
          released: '2023-03-01',
          background_image: 'https://github.com/mu-xiaofan/Icy/blob/main/icy.png',
        },
      ];
      setSearchResults({ type: 'game', data: dummyGameResults });
      setTeamSearchMessage('');
    } else if (searchType === 'team') {
      // Dummy team search: simulate a match if search keyword includes 'alpha' or 'beta'
      const lowerSearch = searchValue.toLowerCase();
      let dummyTeamMatches = [];
      if (lowerSearch.includes('alpha') || lowerSearch.includes('beta')) {
        dummyTeamMatches = [
          { id: 'team-1', name: 'Team 1' },
          { id: 'team-2', name: 'Team 2' },
        ];
      }
      if (dummyTeamMatches.length > 0) {
        setSearchResults({ type: 'team', data: dummyTeamMatches });
        setTeamSearchMessage('');
      } else {
        // No matching teams found then show message and recommended teams
        const recommendedTeams = [
          { id: 'team-1', name: 'Team 1' },
          { id: 'team-2', name: 'Team 2' },
          { id: 'team-3', name: 'Team 3' },
        ];
        setTeamSearchMessage('No matching teams found. Showing recommended teams instead.');
        setSearchResults({ type: 'team', data: recommendedTeams });
      }
    }
    console.log(`Search submitted for ${searchType} with query: ${searchValue}`);
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
            onChange={(e) => {
              setSearchType(e.target.value);
              setSearchResults(null); // Reset search results when switching
              setTeamSearchMessage('');
            }}
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

      {searchResults ? (
        searchResults.type === 'game' ? (
          <>
            <h2>Search Results for Games</h2>
            <div className="cards-container">
              {searchResults.data.map((game) => (
                <div className="card" key={game.id}>
                  <Link to={`/game/${game.id}`}>
                    <img
                      src={game.background_image || logo}
                      alt={game.name}
                      style={{ width: '100%' }}
                    />
                  </Link>
                  <h3>{game.name}</h3>
                  <p>Released: {game.released || 'N/A'}</p>
                </div>
              ))}
            </div>
          </>
        ) : (
          <>
            <h2>Search Results for Teams</h2>
            {teamSearchMessage && <p>{teamSearchMessage}</p>}
            <div className="cards-container">
              {searchResults.data.map((team) => (
                <div className="card" key={team.id}>
                  <h3>{team.name}</h3>
                </div>
              ))}
            </div>
          </>
        )
      ) : (
        <>
          <h2>Random Games from RAWG</h2>
          <div className="cards-container">
            {randomGames.map((game) => (
              <div className="card" key={game.id}>
                <Link to={`/game/${game.id}`}>
                  <img
                    src={game.background_image || logo}
                    alt={game.name}
                    style={{ width: '100%' }}
                  />
                </Link>
                <h3>{game.name}</h3>
                <p>Released: {game.released || 'N/A'}</p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default App;