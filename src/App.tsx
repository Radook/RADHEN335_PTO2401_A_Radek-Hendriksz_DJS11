import React from 'react';
import Showlist from './components/Showlist'; // Ensure the path matches the casing

const App: React.FC = () => {
  return (
    <div>
      <h1>Podcast Shows</h1>
      <Showlist /> {/* Ensure this is correctly rendering the ShowList component */}
    </div>
  );
};

export default App;
