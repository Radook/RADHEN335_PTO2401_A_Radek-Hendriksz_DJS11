import React, { useState, useEffect } from "react";
import "./ShowList.css";
import Modal from "./Modal";

// Define the Podcast interface to type the podcast data
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

const ShowList: React.FC = () => {
  // State hooks for various variables used in the component
  const [podcasts, setPodcasts] = useState<Podcast[]>([]); // List of podcasts to display
  const [searchQuery, setSearchQuery] = useState(""); // Search query for filtering podcasts
  const [sortOption, setSortOption] = useState<"A-Z" | "Z-A" | "Newest" | "Oldest">("A-Z"); // Sort option for podcasts
  const [selectedGenre, setSelectedGenre] = useState<number | null>(null); // Filter by genre
  const [selectedFavoritesFilter, setSelectedFavoritesFilter] = useState<boolean>(false); // Show only favorites or all
  const [selectedPodcast, setSelectedPodcast] = useState<Podcast | null>(null); // Selected podcast for modal display
  const [favorites, setFavorites] = useState<number[]>([]); // Array to store favorite podcast IDs
  const [episodeFavorites, setEpisodeFavorites] = useState<string[]>([]); // Array to store favorite episode unique IDs

  // Effect hook to fetch podcasts data from the API
  useEffect(() => {
    const fetchPodcasts = async () => {
      try {
        // Fetch podcasts from the API
        const res = await fetch(`https://podcast-api.netlify.app/?page=&limit=`);
        const data = await res.json();

        // Load episode favorites from local storage if available
        const savedEpisodeFavorites = JSON.parse(localStorage.getItem("episodeFavorites") || "[]");
        setEpisodeFavorites(savedEpisodeFavorites);

        if (Array.isArray(data)) {
          setPodcasts(data); // Set fetched podcasts to state
        } else {
          console.error("Invalid data format"); // Handle invalid data
        }
      } catch (error) {
        console.error("Error fetching podcasts:", error); // Handle fetch errors
      }
    };

    fetchPodcasts(); 
  }, []);

  // Function to toggle podcast favorites on or off
  const toggleFavoritePodcast = (podcastId: number) => {
    const updatedFavorites = favorites.includes(podcastId)
      ? favorites.filter((id) => id !== podcastId) // Remove from favorites
      : [...favorites, podcastId]; // Add to favorites

    // Save updated favorites to local storage
    localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
    setFavorites(updatedFavorites); // Update state
  };

  // Function to toggle episode favorites on or off
  const toggleFavoriteEpisode = (uniqueId: string) => {
    const updatedEpisodeFavorites = episodeFavorites.includes(uniqueId)
      ? episodeFavorites.filter((id) => id !== uniqueId) // Remove from episode favorites
      : [...episodeFavorites, uniqueId]; // Add to episode favorites

    setEpisodeFavorites(updatedEpisodeFavorites); // Update state
    localStorage.setItem("episodeFavorites", JSON.stringify(updatedEpisodeFavorites)); // Save to local storage
  };

  // Filtering and sorting logic for podcasts
  const filteredPodcasts = podcasts
    .filter((podcast) =>
      // Filter by search query, genre, and favorites
      podcast.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
      (selectedGenre === null || podcast.genres.includes(selectedGenre)) &&
      (!selectedFavoritesFilter || favorites.includes(podcast.id))
    )
    .sort((a, b) => {
      // Sort based on selected sort option
      switch (sortOption) {
        case "A-Z":
          return a.title.localeCompare(b.title); // Sort alphabetically A-Z
        case "Z-A":
          return b.title.localeCompare(a.title); // Sort alphabetically Z-A
        case "Newest":
          return new Date(b.updated).getTime() - new Date(a.updated).getTime(); // Sort by most recent
        case "Oldest":
          return new Date(a.updated).getTime() - new Date(b.updated).getTime(); // Sort by oldest
        default:
          return 0; // Default sorting
      }
    });

  // Function to handle podcast selection 
  const handlePodcastClick = (podcast: Podcast) => {
    setSelectedPodcast(podcast); // Set selected podcast for modal
  };

  // Function to close the modal
  const closeModal = () => {
    setSelectedPodcast(null); // Set selected podcast to null
  };

  // Function to reset all listening history (favorites and episode favorites)
  const resetListeningHistory = () => {
    const confirmReset = window.confirm("Are you sure you want to reset your entire listening history?");
    if (confirmReset) {
      localStorage.removeItem("favorites"); // Remove favorites from local storage
      localStorage.removeItem("episodeFavorites"); // Remove episode favorites from local storage
      setFavorites([]); // Clear favorites state
      setEpisodeFavorites([]); // Clear episode favorites state
    }
  };

  return (
    <div className="show-list">
      {/* Search bar to filter podcasts by title */}
      <input
        type="text"
        placeholder="Search podcasts..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)} // Update search query
        className="search-bar"
      />

      {/* Sort options dropdown */}
      <div className="genre-filter">
        <label>Sort by:</label>
        <select value={sortOption} onChange={(e) => setSortOption(e.target.value as typeof sortOption)}>
          <option value="A-Z">Title: A-Z</option>
          <option value="Z-A">Title: Z-A</option>
          <option value="Newest">Most Recently Updated</option>
          <option value="Oldest">Oldest Updated</option>
        </select>
      </div>

      {/* Genre filter dropdown */}
      <div className="genre-filter">
        <label>Filter by Genre:</label>
        <select value={selectedGenre || ""} onChange={(e) => setSelectedGenre(Number(e.target.value) || null)}>
          <option value="">All Genres</option>
          {/* List of genres */}
          <option value={1}>Personal Growth</option>
          <option value={2}>Investigative Journalism</option>
          <option value={3}>History</option>
          <option value={4}>Comedy</option>
          <option value={5}>Entertainment</option>
          <option value={6}>Business</option>
          <option value={7}>Fiction</option>
          <option value={8}>News</option>
          <option value={9}>Kids and Family</option>
        </select>
      </div>

      {/* Favorites filter dropdown */}
      <div className="genre-filter">
        <label>Show Favorites Only:</label>
        <select value={selectedFavoritesFilter ? "Favorites" : "All"} onChange={(e) => setSelectedFavoritesFilter(e.target.value === "Favorites")}>
          <option value="All">All Podcasts</option>
          <option value="Favorites">Favorites Only</option>
        </select>
      </div>

      {/* Button to reset favorites */}
      <button onClick={resetListeningHistory} className="reset-button">
        Reset Favorites
      </button>

      {/* Render podcasts list */}
      <div className="show-items">
        {filteredPodcasts.length > 0 ? (
          filteredPodcasts.map((podcast) => (
            <div key={podcast.id} className="show-item" onClick={() => handlePodcastClick(podcast)}>
              <img src={podcast.image} alt={podcast.title} />
              <h3>{podcast.title}</h3>
              <p>{podcast.description.slice(0, 100)}...</p>
              <p>Seasons: {podcast.seasons}</p>
              <p>Last Updated: {new Date(podcast.updated).toLocaleDateString()}</p>

              {/* Favorite button for podcasts */}
              <button onClick={(e) => { e.stopPropagation(); toggleFavoritePodcast(podcast.id); }}>
                {favorites.includes(podcast.id) ? "Remove from Favorites" : "Add to Favorites"}
              </button>
            </div>
          ))
        ) : (
          <p>No podcasts available.</p>
        )}
      </div>

      {/* Modal display if a podcast is selected */}
      {selectedPodcast && (
        <Modal
          podcast={selectedPodcast}
          closeModal={closeModal}
          toggleFavoriteEpisode={toggleFavoriteEpisode}
          episodeFavorites={episodeFavorites}
          setEpisodeFavorites={setEpisodeFavorites} // Pass setEpisodeFavorites here
        />
      )}
    </div>
  );
};

export default ShowList;
