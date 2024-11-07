import React, { useState, useEffect } from "react";

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
  seasons: { season: number; title?: string; image?: string; episodes?: any[] }[];
  episodes?: { season: number; title: string; episodeNumber: number; audioUrl?: string }[];
}

interface ModalProps {
  podcast: Podcast;
  closeModal: () => void;
}

// Seasons component
const Seasons: React.FC<{ seasons: any[]; onSeasonChange: (season: number | null) => void }> = ({ seasons, onSeasonChange }) => {
  const [selectedSeason, setSelectedSeason] = useState<number | null>(null);

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
        {seasons.map((season, index) => (
          <option key={season.season} value={season.season}>
            {season.title ? `Season ${season.season}: ${season.title}` : `Season ${season.season}`}
          </option>
        ))}
      </select>
    </div>
  );
};

const Modal: React.FC<ModalProps> = ({ podcast, closeModal }) => {
  const [seasons, setSeasons] = useState<any[]>([]); // State to store seasons
  const [selectedSeason, setSelectedSeason] = useState<number | null>(null);
  const [episodes, setEpisodes] = useState<any[]>([]); // State to store episodes of selected season

  // Fetch seasons based on podcast id
  useEffect(() => {
    const fetchSeasons = async () => {
      try {
        const response = await fetch(`https://podcast-api.netlify.app/id/${podcast.id}`);
        const data = await response.json();
        console.log("API Response:", data);

        // Assuming the API returns a seasons array of objects with `season` field
        const fetchedSeasons = data.seasons || []; // Ensure seasons is an array
        setSeasons(fetchedSeasons); // Set seasons state
        if (fetchedSeasons.length > 0) {
          setSelectedSeason(fetchedSeasons[0].season); // Set the first season as selected (optional)
        }
      } catch (error) {
        console.error("Error fetching seasons:", error);
      }
    };

    if (podcast.id) {
      fetchSeasons(); // Fetch the seasons if podcast.id is available
    }
  }, [podcast.id]); // Fetch seasons when the podcast id changes

  // Handler for season change, to be passed to the Seasons component
  const handleSeasonChange = (season: number | null) => {
    setSelectedSeason(season);
    console.log("Selected season:", season);

    if (season !== null) {
      // Find the episodes for the selected season
      const selectedSeasonData = seasons.find((s) => s.season === season);
      if (selectedSeasonData && selectedSeasonData.episodes) {
        setEpisodes(selectedSeasonData.episodes); // Update the episodes state with the selected season's episodes
      }
    } else {
      setEpisodes([]); // Clear episodes if no season is selected
    }
  };

  return (
    <div className="modal-overlay" onClick={closeModal}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-button" onClick={closeModal}>✖</button>
        <h2>{podcast.title}</h2>
        <img src={podcast.image} alt={podcast.title} />

        {/* Seasons Dropdown with fetched seasons */}
        <Seasons seasons={seasons} onSeasonChange={handleSeasonChange} />

        {/* Display genre names */}
        <p className="modal-genre">
          Genres: {podcast.genres.map((genreId) => GENRE_TITLES[genreId]).join(", ")}
        </p>

        <h2>{podcast.description}</h2>

        {/* Display Episodes for the selected season */}
        {episodes.length > 0 ? (
          <div className="episodes">
            <h3>Episodes:</h3>
            <ul>
              {episodes.map((episode, index) => (
                <li key={index}>
                  <p><strong>{episode.title}</strong> - Episode {episode.episodeNumber}</p>
                  
                  {/* Re-Added Audio Player */}
                  <div className="audio-player">
                    <audio controls>
                      <source src={episode.audioUrl || "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"} type="audio/mp3" />
                      Your browser does not support the audio element.
                    </audio>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p>No episodes available for this season.</p>
        )}
      </div>
    </div>
  );
};

export default Modal;
