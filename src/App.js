import logo from './logo.svg';
import './App.css';
import React, { useState } from 'react';

//Placeholder data for game cards

const sampleGames = [
  {
    id: 1,
    name: 'Placeholder Game 1',
    description: 'NA1',
    thumbnail: logo, // Using the same logo as a placeholder
  },
  {
    id: 2,
    name: 'Placeholder Game 2',
    description: 'NA2',
    thumbnail: logo,
  },
  {
    id: 3,
    name: 'Placeholder Game 3',
    description: 'NA3',
    thumbnail: logo,
  }
];

function App() {
  // Example state for search input
  const [searchValue, setSearchValue] = useState('');

  const handleSearchChange = (event) => {
    setSearchValue(event.target.value);
  };

  const handleSearchSubmit = () => {
    // For now just log the search value to the console
    // call an API or filter your game list here
    console.log('Search submitted for:', searchValue);
  };

  const handleProfileClick = () => {
    // Placeholder: navigate to the profile page or show a profile modal
    console.log('Profile Clicked');
  };

  const handleLoginClick = () => {
    // Placeholder: navigate to login or open a login modal
    console.log('Login Clicked');
  };
  return (
    <div className="App">
      {/* Header section with search bar and action buttons */}
      <div className="header-bar">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search games..."
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

      {/* A row of placeholder game cards */}
      <div className="game-cards-container">
        {sampleGames.map((game) => (
          <div className="game-card" key={game.id}>
            {/* thumbnail */}
            <img src={game.thumbnail} alt={game.name} style={{ width: '100%' }} />
            <h3>{game.name}</h3>
            <p>{game.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
