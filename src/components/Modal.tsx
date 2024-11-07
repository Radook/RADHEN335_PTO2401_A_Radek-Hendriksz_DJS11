import React, { useState } from "react";

// Genre ID to title mapping
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

interface Podcast {
  id: number;
  title: string;
  description: string;
  image: string;
  genres: number[];
  seasons: number[];
  episodes?: { season: number; title: string; episodeNumber: number; audioUrl?: string }[];
}

interface ModalProps {
  podcast: Podcast;
  closeModal: () => void;
}

// Seasons component
const Seasons: React.FC<{ seasons: number[]; onSeasonChange: (season: number | null) => void }> = ({ seasons, onSeasonChange }) => {
  const [selectedSeason, setSelectedSeason] = useState<number | null>(null);

  // Log the seasons prop to check its value
  console.log("Seasons prop:", seasons);

  const handleSeasonChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const season = Number(event.target.value) || null;
    setSelectedSeason(season);
    onSeasonChange(season); // Notify parent component of the selected season
  };

  // If seasons is not an array, render a fallback message
  if (!Array.isArray(seasons) || seasons.length === 0) {
    return <div>No seasons available</div>; // Updated message for no seasons
  }

  return (
    <div className="season-dropdown">
      <label htmlFor="season-select">Select Season:</label>
      <select
        id="season-select"
        value={selectedSeason || ""}
        onChange={handleSeasonChange}
      >
        <option value="">All Seasons</option>
        {seasons.map((season) => (
          <option key={season} value={season}>Season {season}</option>
        ))}
      </select>
    </div>
  );
};

const Modal: React.FC<ModalProps> = ({ podcast, closeModal }) => {
  // Handler for season change, to be passed to the Seasons component
  const handleSeasonChange = (season: number | null) => {
    console.log("Selected season:", season);
    // Additional logic to handle season change can be added here
  };

  // Check if podcast.seasons is defined and has values
  console.log("Podcast seasons:", podcast.seasons);

  return (
    <div className="modal-overlay" onClick={closeModal}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-button" onClick={closeModal}>✖</button>
        <h2>{podcast.title}</h2>
        <img src={podcast.image} alt={podcast.title} />

        {/* Seasons Dropdown */}
        <Seasons seasons={[1, 2, 3, 4, 5]} onSeasonChange={handleSeasonChange} />

        {/* Display genre names */}
        <p className="modal-genre">
          Genres: {podcast.genres.map((genreId) => GENRE_TITLES[genreId]).join(", ")}
        </p>

        <h2>{podcast.description}</h2>

        {/* Audio Player */}
        <div className="audio-player">
          <audio controls>
            <source src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" type="audio/mp3" />
            Your browser does not support the audio element.
          </audio>
        </div>
      </div>
    </div>
  );
};

export default Modal;
