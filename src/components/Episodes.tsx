import React from "react";
import { FaStar, FaRegStar } from 'react-icons/fa';
import './Episodes.css';

interface Episode {
  season: number;
  title: string;
  episodeNumber: number;
  audioUrl?: string;
}

interface EpisodesProps {
  episodes: Episode[];
  episodeFavorites: string[];
  toggleFavoriteEpisode: (uniqueId: string) => void;
  setEpisodeFavorites: React.Dispatch<React.SetStateAction<string[]>>;
}

const Episodes: React.FC<EpisodesProps> = ({ episodes, episodeFavorites, toggleFavoriteEpisode, setEpisodeFavorites }) => {
  
  const isFavorite = (uniqueId: string) => episodeFavorites.includes(uniqueId);

  // New function to clear all favorite episodes
  const clearFavoriteEpisodes = () => {
    const confirmClear = window.confirm("Are you sure you want to clear all favorite episodes?");
    if (confirmClear) {
      setEpisodeFavorites([]); // Clear the state
      localStorage.removeItem("episodeFavorites"); // Clear from localStorage
    }
  };

  return (
    <div className="episodes">
      <h3>Episodes:</h3>
      <button onClick={clearFavoriteEpisodes} className="clear-favorites-button">
        Clear All Favorite Episodes
      </button>
      <ul>
        {episodes.map((episode) => {
          const uniqueId = `${episode.season}-${episode.episodeNumber}`; // Construct unique ID

          return (
            <li key={uniqueId} className="episode-item">
              <p><strong>{episode.title}</strong> - Episode {episode.episodeNumber}</p>
              <button onClick={() => {
                console.log(`Toggling favorite for: ${uniqueId}`); // Debugging statement
                toggleFavoriteEpisode(uniqueId);
              }}>
                {isFavorite(uniqueId) ? (
                  <FaStar color="gold" />
                ) : (
                  <FaRegStar color="gray" />
                )}
              </button>
              <div className="audio-player">
                <audio controls>
                  <source src={episode.audioUrl || "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"} type="audio/mp3" />
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
