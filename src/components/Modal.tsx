import React, { useState, useEffect } from "react";
import './modal.css';
import Seasons from './Seasons';
import Episodes from './Episodes';

// Mapping genre IDs to genre titles for display
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

// Define the Podcast structure
interface Podcast {
  id: number;
  title: string;
  description: string;
  image: string;
  genres: number[];
  seasons: number[];
  episodes?: { season: number; title: string; episodeNumber: number; audioUrl?: string }[];
}

// Define the props for the Modal component
interface ModalProps {
  podcast: Podcast;
  closeModal: () => void;
  toggleFavoriteEpisode: (uniqueId: string) => void;
  episodeFavorites: string[];
  setEpisodeFavorites: React.Dispatch<React.SetStateAction<string[]>>;
}

// Define the Episode structure
interface Episode {
  id: number;
  season: number;
  title: string;
  episodeNumber: number;
  audioUrl?: string;
}

// Define the Season structure
interface Season {
  season: number;
  episodes: Episode[];
}

const Modal: React.FC<ModalProps> = ({ podcast, closeModal, toggleFavoriteEpisode, episodeFavorites, setEpisodeFavorites }) => {
  const [seasons, setSeasons] = useState<Season[]>([]); // Store season data
  const [episodes, setEpisodes] = useState<Episode[]>([]); // Store episode data

  // Fetch the podcast's seasons and episodes on mount or when podcast.id changes
  useEffect(() => {
    const fetchSeasons = async () => {
      try {
        const response = await fetch(`https://podcast-api.netlify.app/id/${podcast.id}`);
        const data = await response.json();
        const fetchedSeasons = data.seasons || [];
        setSeasons(fetchedSeasons); // Update the seasons state
        if (fetchedSeasons.length > 0) {
          // Set episodes from the first season by default
          setEpisodes(fetchedSeasons[0].episodes || []);
        }
      } catch (error) {
        console.error("Error fetching seasons:", error);
      }
    };

    if (podcast.id) {
      fetchSeasons(); // Trigger fetching when the podcast.id changes
    }
  }, [podcast.id]);

  // Function to handle the change of selected season
  const handleSeasonChange = (season: number | null) => {
    if (season !== null) {
      // Find the selected season and update the episodes
      const selectedSeasonData = seasons.find((s) => s.season === season);
      if (selectedSeasonData && selectedSeasonData.episodes) {
        setEpisodes(selectedSeasonData.episodes); // Update episodes for the selected season
      }
    } else {
      setEpisodes([]); // Clear episodes when no season is selected
    }
  };

  return (
    <div className="modal-overlay" onClick={closeModal}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-button" onClick={closeModal}>✖</button>

        {/* Display podcast image */}
        <img src={podcast.image} alt={podcast.title} />

        {/* Display podcast genre(s) */}
        <p className="modal-genre">
          Genres: {podcast.genres.map((genreId) => GENRE_TITLES[genreId]).join(", ")}
        </p>

        {/* Display podcast description */}
        <h3>{podcast.description}</h3>

        {/* Render the Seasons component, passing seasons data and a callback for season change */}
        <Seasons seasons={seasons} onSeasonChange={handleSeasonChange} />

        {/* Render the Episodes component, passing episodes data and favorite functionality */}
        <Episodes 
          episodes={episodes} 
          episodeFavorites={episodeFavorites} 
          toggleFavoriteEpisode={toggleFavoriteEpisode} 
          setEpisodeFavorites={setEpisodeFavorites}
        />
      </div>
    </div>
  );
};

export default Modal;
