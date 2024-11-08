import React from 'react';
import Showlist from './components/Showlist'; // Ensure the path matches the casing
import './App.css';

const App: React.FC = () => {
  return (
    <div className="app-container">
      <h1>Podcast Shows</h1>
      <div className="show-list-container">
        <Showlist />
      </div>
    </div>
  );
};

export default App;
