import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import App from './App';
import TeamInfo from './components/TeamInfo';
import BuildTeam from './components/BuildTeam';
import Login from './components/Login';
import Register from './components/Register';
import ProfilePage from './components/ProfilePage';
import GameInfo from './components/GameInfo';

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/team/:teamId" element={<TeamInfo />} />
        <Route path="/build-team" element={<BuildTeam />} />
        <Route path="/game/:gameId" element={<GameInfo />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;