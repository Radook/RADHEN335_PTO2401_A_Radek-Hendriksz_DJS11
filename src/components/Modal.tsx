import React, { useState, useEffect } from "react";
import './modal.css';
import Seasons from './Seasons';
import Episodes from './Episodes';

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
  setEpisodeFavorites: React.Dispatch<React.SetStateAction<string[]>>;
}

interface Episode {
  id: number;
  duration: number;
  season: number;
  title: string;
  episodeNumber: number;
  audioUrl?: string;
}

interface Season {
  season: number;
  episodes: Episode[];
}

const Modal: React.FC<ModalProps> = ({ podcast, closeModal, toggleFavoriteEpisode, episodeFavorites, setEpisodeFavorites }) => {
  const [seasons, setSeasons] = useState<Season[]>([]);
  const [selectedSeason, setSelectedSeason] = useState<number | null>(null);
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);

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

  useEffect(() => {
    // Add event listener for beforeunload
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isAudioPlaying) {
        e.preventDefault();
        e.returnValue = "Audio is still playing. Are you sure you want to leave?";
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [isAudioPlaying]);

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

  const handleAudioPlay = () => setIsAudioPlaying(true);
  const handleAudioPause = () => setIsAudioPlaying(false);

  return (
    <div className="modal-overlay" onClick={closeModal}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-button" onClick={closeModal}>✖</button>
        {/* <h2>{podcast.title}</h2> */}
        <img src={podcast.image} alt={podcast.title} />

        <p className="modal-genre">
          Genres: {podcast.genres.map((genreId) => GENRE_TITLES[genreId]).join(", ")}
        </p>

        <h3>{podcast.description}</h3>
        {/* <h3>Selected Season: {selectedSeason !== null ? `Season ${selectedSeason}` : "None"}</h3> */}
        <Seasons seasons={seasons} onSeasonChange={handleSeasonChange} />

        <Episodes 
          episodes={episodes} 
          episodeFavorites={episodeFavorites} 
          toggleFavoriteEpisode={toggleFavoriteEpisode} 
          setEpisodeFavorites={setEpisodeFavorites}
          onAudioPlay={handleAudioPlay} 
          onAudioPause={handleAudioPause}
        />
      </div>
    </div>
  );
};

export default Modal;
