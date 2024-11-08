import React from "react";
import { FaStar, FaRegStar } from 'react-icons/fa'; // Star icons
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
}

const Episodes: React.FC<EpisodesProps> = ({ episodes, episodeFavorites, toggleFavoriteEpisode }) => {
  
  const isFavorite = (uniqueId: string) => episodeFavorites.includes(uniqueId);

  return (
    <div className="episodes">
      <h3>Episodes:</h3>
      <ul>
        {episodes.map((episode) => {
          const uniqueId = `${episode.season}-${episode.episodeNumber}`; // Unique ID for each episode

          return (
            <li key={uniqueId} className="episode-item">
              <p><strong>{episode.title}</strong> - Episode {episode.episodeNumber}</p>
              <button onClick={() => toggleFavoriteEpisode(uniqueId)}>
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
