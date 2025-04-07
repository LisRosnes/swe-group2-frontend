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
  const [currentPage, setCurrentPage] = useState(1); // for game search

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
      // Using rawg API for game search with top 12 matches
      fetch(`https://api.rawg.io/api/games?key=${RAWG_API_KEY}&search=${encodeURIComponent(searchValue)}&page_size=12`)
        .then((res) => res.json())
        .then((data) => {
          if (data.results) {
            setSearchResults({ type: 'game', data: data.results });
            setCurrentPage(1); // Reset page to 1 for new search
          }
        })
        .catch((err) => console.error('Error searching games:', err));
      setTeamSearchMessage('');
    } else if (searchType === 'team') {
      // Dummy team search
      const lowerSearch = searchValue.toLowerCase();
      let dummyTeamMatches = [];
      if (lowerSearch.includes('1') || lowerSearch.includes('2')) {
        dummyTeamMatches = [
          {
            id: 'team-1',
            game: 'Brutal Legend',
            name: 'Alpha Squad',
            members: ['Alice', 'Bob', 'Charlie'],
            background_image: 'https://media.rawg.io/media/resize/640/-/screenshots/ded/ded6b47a8903f3ff9903f2068f132942.jpg',
          },
          {
            id: 'team-2',
            game: 'Outlast',
            name: 'Survivors',
            members: ['Dave', 'Eve'],
            background_image: 'https://media.rawg.io/media/resize/420/-/screenshots/83f/83ff600f8e2dd8507e7961d3e9f32126.jpg',
          },
        ];
      }
      if (dummyTeamMatches.length > 0) {
        setSearchResults({ type: 'team', data: dummyTeamMatches });
        setTeamSearchMessage('');
      } else {
        // No matching teams found then show message and recommended teams
        const recommendedTeams = [
          {
            id: 'team-1',
            game: 'Brutal Legend',
            name: 'Alpha Squad',
            members: ['Alice', 'Bob', 'Charlie'],
            background_image: 'https://media.rawg.io/media/resize/640/-/screenshots/ded/ded6b47a8903f3ff9903f2068f132942.jpg',
          },
          {
            id: 'team-2',
            game: 'Outlast',
            name: 'Survivors',
            members: ['Dave', 'Eve'],
            background_image: 'https://media.rawg.io/media/resize/420/-/screenshots/83f/83ff600f8e2dd8507e7961d3e9f32126.jpg',
          },
          {
            id: 'team-3',
            game: 'Quake Champions',
            name: 'Champions United',
            members: ['Frank', 'Grace', 'Heidi'],
            background_image: 'https://media.rawg.io/media/resize/420/-/screenshots/cbd/cbd0b3115423fb6d25f13fa6091ffbf2.jpg',
          },
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

  const paginatedGameResults =
    searchResults && searchResults.type === 'game'
      ? searchResults.data.slice((currentPage - 1) * 6, currentPage * 6)
      : [];

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
                {username} Profile
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
            <div className="search-results-grid">
              {paginatedGameResults.map((game) => (
                <Link to={`/game/${game.id}`} className="game-card" key={game.id}>
                  <img src={game.background_image || logo} alt={game.name} />
                  <h3>{game.name}</h3>
                  <p>Released: {game.released}</p>
                </Link>
              ))}
            </div>
            {/* Pagination Controls */}
            <div className="pagination">
              {currentPage > 1 && (
                <button onClick={() => setCurrentPage(currentPage - 1)}>
                  Previous Page
                </button>
              )}
              {currentPage * 6 < searchResults.data.length && (
                <button onClick={() => setCurrentPage(currentPage + 1)}>
                  Next Page
                </button>
              )}
            </div>
          </>
        ) : (
          <>
            <h2>Search Results for Teams</h2>
            {teamSearchMessage && <p>{teamSearchMessage}</p>}
            <div className="search-results-grid">
              {searchResults.data.map((team) => (
                <Link to={`/team/${team.id}`} className="team-card" key={team.id}>
                  <img src={team.background_image || logo} alt={team.game} />
                  <h4>Game: {team.game}</h4>
                  <h3>Team: {team.name}</h3>
                  <p>Members: {team.members.join(', ')}</p>
                </Link>
              ))}
            </div>
          </>
        )
      ) : (
        <>
          <h2>Games Discovery</h2>
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