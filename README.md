# Game Website Frontend
Our web application provides a comprehensive platform for gamers to search, view, and interact with game information and build teams for multiplayer games.

## Prerequisites

## Getting Started

1. Clone the repo 
   ```bash
   git clone https://github.com/LisRosnes/swe-group2-frontend.git
   cd swe_group2_frontend
   ```

1. A RAWG API key for game details: https://rawg.io/apidocs
   place in .env as
   REACT_APP_RAWG_API_KEY=your_rawg_api_key_here


2. Navigate to the project directory:
   ```bash
   cd your-project-directory
   ```

2. Install dependencies:
   ```bash
   npm install
   npm install axios
   ```

3. Start the development server:
   ```bash
   npm start
   ```

4. Register and log in:
   If this page is not working, you may need to change the port on the Login and Register page to connect properly to the backend..

5. You can now browse all the available pages.

- **Homepage Navigation:**  
  Click on a game image to enter the **Game Info** page.

- **Top-Left Game Menu:**  
  Click the "Game" label on the top-left to choose between **Game Search** and **Team Search**.

- **Team Search:**  
  After performing a team search, you will see a list of available teams.  
  Click on any team to view its detailed **Team Info** page.

## Page Structure Overview

### Home Page
The main page of our application serves as the central hub with multiple features:
- Displays a curated list of different games and teams
- Includes a search bar for finding specific games
- Features navigation buttons for Login, Profile, and Build Team

### Game Page
When a user clicks on a game title from the home page:
- Presents detailed information about the selected game
- Shows comprehensive game data, specifications, and related content
- Optimized for readability with custom styling for dark backgrounds

### Team Page
Accessed by clicking on a team name:
- Displays detailed team information
- Lists all team members
- Shows team creation date and history
- Presents other relevant team statistics

### Build Team Page
Accessible via the Build Team button:
- Provides interface for creating new teams
- Allows users to set team parameters
- Features tools for team customization and management

### Profile Page
When users click the Profile button:
- Shows user's personal information
- Displays history of user's comments and activities
- Features a back button for easy navigation to previous pages
- Edit profile, add info, avatar etc..

### Login/Register Page
Accessed through the Login button:
- Provides user authentication interface
- Includes options for new user registration
- Features clean, intuitive design for ease of use

Each page is designed with consistent navigation elements and optimized styling for an enhanced user experience.
