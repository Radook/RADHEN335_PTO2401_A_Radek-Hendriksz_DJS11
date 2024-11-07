import React, { useState, useEffect } from "react";
import './modal.css'; // Importing the CSS file
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
  updated: string;
  seasons: number[];
  episodes?: { season: number; title: string; episodeNumber: number; audioUrl?: string }[];
}

interface ModalProps {
  podcast: Podcast;
  closeModal: () => void;
  toggleFavoriteEpisode: (uniqueId: string) => void;
  episodeFavorites: string[];
}

// Define types for Season and Episode
interface Episode {
  season: number;
  title: string;
  episodeNumber: number;
  audioUrl?: string;
}

interface Season {
  season: number;
  title?: string;
  episodes: Episode[];
}

// Seasons component
const Seasons: React.FC<{ seasons: Season[]; onSeasonChange: (season: number | null) => void }> = ({ seasons, onSeasonChange }) => {
  const [selectedSeason, setSelectedSeason] = useState<number | null>(null);

  const handleSeasonChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const season = Number(event.target.value) || null;
    setSelectedSeason(season);
    onSeasonChange(season); // Notify parent component of the selected season
  };

  if (!Array.isArray(seasons) || seasons.length === 0) {
    return <div>No seasons available</div>;
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
          <option key={season.season} value={season.season}>
            {season.title ? `Season ${season.season}: ${season.title}` : `Season ${season.season}`}
          </option>
        ))}
      </select>
    </div>
  );
};

const Modal: React.FC<ModalProps> = ({ podcast, closeModal, toggleFavoriteEpisode, episodeFavorites }) => {
  const [seasons, setSeasons] = useState<Season[]>([]);
  const [selectedSeason, setSelectedSeason] = useState<number | null>(null);
  const [episodes, setEpisodes] = useState<Episode[]>([]);

  useEffect(() => {
    const fetchSeasons = async () => {
      try {
        const response = await fetch(`https://podcast-api.netlify.app/id/${podcast.id}`);
        const data = await response.json();
        const fetchedSeasons = data.seasons || [];
        setSeasons(fetchedSeasons);
        if (fetchedSeasons.length > 0) {
          setSelectedSeason(fetchedSeasons[0].season);
        }
      } catch (error) {
        console.error("Error fetching seasons:", error);
      }
    };

    if (podcast.id) {
      fetchSeasons();
    }
  }, [podcast.id]);

  const handleSeasonChange = (season: number | null) => {
    setSelectedSeason(season);
    if (season !== null) {
      const selectedSeasonData = seasons.find((s) => s.season === season);
      if (selectedSeasonData && selectedSeasonData.episodes) {
        setEpisodes(selectedSeasonData.episodes);
      }
    } else {
      setEpisodes([]);
    }
  };

  return (
    <div className="modal-overlay" onClick={closeModal}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-button" onClick={closeModal}>✖</button>
        <h2>{podcast.title}</h2>
        <img src={podcast.image} alt={podcast.title} />

        <Seasons seasons={seasons} onSeasonChange={handleSeasonChange} />

        <p className="modal-genre">
          Genres: {podcast.genres.map((genreId) => GENRE_TITLES[genreId]).join(", ")}
        </p>

        <h2>{podcast.description}</h2>

        {episodes.length > 0 ? (
          <div className="episodes">
            <h3>Episodes:</h3>
            <ul>
              {episodes.map((episode) => {
                const uniqueId = `${selectedSeason}-${episode.episodeNumber}`;
                return (
                  <li key={uniqueId} className="episode-item">
                    <p><strong>{episode.title}</strong> - Episode {episode.episodeNumber}</p>
                    <button onClick={() => toggleFavoriteEpisode(uniqueId)}>
                      {episodeFavorites.includes(uniqueId) ? "Remove from Favorites" : "Add to Favorites"}
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
        ) : (
          <p>No episodes available for this season.</p>
        )}
      </div>
    </div>
  );
};

export default Modal;
