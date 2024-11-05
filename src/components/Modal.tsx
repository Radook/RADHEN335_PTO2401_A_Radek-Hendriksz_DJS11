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
    seasons: Season[]; // Ensure seasons are included
  };
}

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

  const genreTitles = showData.genres.map((id) => GENRE_TITLES[id] || "Unknown Genre");

  const handleSeasonChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedSeasonId(Number(event.target.value));
  };

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
        <select onChange={handleSeasonChange} value={selectedSeasonId || ''} className="season-dropdown">
          <option value="" disabled>Select a season</option>
          {showData.seasons.map((season) => (
            <option key={season.id} value={season.id}>
              {season.title}
            </option>
          ))}
        </select>

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
