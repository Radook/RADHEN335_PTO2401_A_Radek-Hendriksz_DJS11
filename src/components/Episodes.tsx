import React from "react";
import { FaStar, FaRegStar } from 'react-icons/fa'; // Import star icons for favorites
import './Episodes.css';

// Define the structure for Episode data
interface Episode {
  season: number; // Season number
  title: string; // Episode title
  episodeNumber: number; // Episode number
  audioUrl?: string; // Optional audio URL for the episode
}

// Define the props expected by the Episodes component
interface EpisodesProps {
  episodes: Episode[]; // List of episodes
  episodeFavorites: string[]; // List of favorite episodes' unique IDs
  toggleFavoriteEpisode: (uniqueId: string) => void; // Callback to toggle favorite status
  setEpisodeFavorites: React.Dispatch<React.SetStateAction<string[]>>; // State setter for episodeFavorites
}

const Episodes: React.FC<EpisodesProps> = ({ 
  episodes, 
  episodeFavorites, 
  toggleFavoriteEpisode, 
  setEpisodeFavorites 
}) => {

  // Function to check if an episode is in the favorites list
  const isFavorite = (uniqueId: string) => episodeFavorites.includes(uniqueId);

  // New function to clear all favorite episodes from the list and localStorage
  const clearFavoriteEpisodes = () => {
    const confirmClear = window.confirm("Are you sure you want to clear all favorite episodes?");
    if (confirmClear) {
      setEpisodeFavorites([]); // Clear the favorites list in the state
      localStorage.removeItem("episodeFavorites"); // Remove favorite episodes from localStorage
    }
  };

  return (
    <div className="episodes">
      {/* Heading for the episodes list */}
      <h3>Episodes:</h3>

      {/* Button to clear all favorite episodes */}
      <button onClick={clearFavoriteEpisodes} className="clear-favorites-button">
        Clear All Favorite Episodes
      </button>

      {/* List of episodes */}
      <ul>
        {episodes.map((episode) => {
          // Ensure season and episodeNumber are defined (fallback to 0 if not provided)
          const season = episode.season || 0;
          const episodeNumber = episode.episodeNumber || 0;

          // Create a unique ID for each episode using season, episode number, and title
          const uniqueId = `${season}-${episodeNumber}-${episode.title}`;

          return (
            <li key={uniqueId} className="episode-item">
              {/* Display episode title */}
              <p><strong>{episode.title}</strong></p>

              {/* Button to toggle episode favorite status */}
              <button onClick={() => {
                console.log(`Toggling favorite for: ${uniqueId}`); // Debugging statement
                toggleFavoriteEpisode(uniqueId); // Call the toggle function
              }}>
                {/* Display filled or outlined star based on favorite status */}
                {isFavorite(uniqueId) ? (
                  <FaStar color="gold" /> // Filled star for favorites
                ) : (
                  <FaRegStar color="gray" /> // Empty star for non-favorites
                )}
              </button>

              {/* Audio player */}
              <div className="audio-player">
                <audio controls>
                  {/* Provides audio source*/}
                  <source src={episode.audioUrl || "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3"} type="audio/mp3" />
                  Your browser does not support the audio element.
                </audio>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Episodes;
