import React, { useState } from 'react';
import './Modal.css';

interface Episode {
  id: number;
  title: string;
  description: string;
}

interface Season {
  id: number;
  title: string;
  episodes: Episode[];
}

interface ModalProps {
  show: boolean;
  onClose: () => void;
  showData: {
    title: string;
    image: string;
    description: string;
    genres: number[];
    seasons: Season[];
  };
}

// Genre ID-to-title mapping
const GENRE_TITLES: { [key: number]: string } = {
  1: "Personal Growth",
  2: "Investigative Journalism",
  3: "History",
  4: "Comedy",
  5: "Entertainment",
  6: "Business",
  7: "Fiction",
  8: "News",
  9: "Kids and Family"
};

const Modal: React.FC<ModalProps> = ({ show, onClose, showData }) => {
  const [selectedSeasonId, setSelectedSeasonId] = useState<number | null>(null);

  if (!show) return null;

  // Map genre IDs to genre titles
  const genreTitles = showData.genres.map((id) => GENRE_TITLES[id] || "Unknown Genre");

  // Function to handle season selection
  const handleSeasonSelect = (seasonId: number) => {
    setSelectedSeasonId(seasonId === selectedSeasonId ? null : seasonId); // Toggle selection
  };

  // Get the selected season's episodes
  const selectedSeason = selectedSeasonId
    ? showData.seasons.find(season => season.id === selectedSeasonId)
    : null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-button" onClick={onClose} aria-label="Close modal">✖</button>
        <h2 className="modal-title">{showData.title}</h2>
        <img src={showData.image} alt={showData.title} className="modal-image" />
        <p className="modal-description">{showData.description}</p>
        <p className="modal-genre">Genre: {genreTitles.join(", ")}</p>
        
        <h3>Seasons</h3>
        <div className="season-list">
          {showData.seasons.length > 0 ? (
            showData.seasons.map((season) => (
              <div key={season.id} className="season-item">
                <h4>
                  <button 
                    onClick={() => handleSeasonSelect(season.id)} 
                    className={`season-toggle ${selectedSeasonId === season.id ? 'active' : ''}`}
                  >
                    {season.title}
                  </button>
                </h4>
                <p>{season.episodes.length} Episodes</p>
              </div>
            ))
          ) : (
            <p>No seasons available.</p>
          )}
        </div>

        {/* Display selected season's episodes */}
        {selectedSeason && (
          <div className="episode-list">
            <h4>Episodes for {selectedSeason.title}</h4>
            {selectedSeason.episodes.length > 0 ? (
              selectedSeason.episodes.map((episode) => (
                <div key={episode.id} className="episode-item">
                  <h5>{episode.title}</h5>
                  <p>{episode.description}</p>
                </div>
              ))
            ) : (
              <p>No episodes available for this season.</p>
            )}
          </div>
        )}

        <button className="back-button" onClick={onClose}>Back to Podcast List</button>
      </div>
    </div>
  );
};

export default Modal;
