import React, { useEffect, useState } from 'react';
import './ShowList.css'; // Import the CSS file
import EpisodePlayer from './EpisodePlayer';
import SeasonEpisodes from './SeasonEpisodes';

interface Show {
  id: number;
  title: string;
  description: string;
  image: string;
  genreIds: number[];
  lastUpdated: string;
  seasons?: Season[]; // Add seasons property here
}

interface Season {
  id: number;
  title: string;
  episodes: Episode[];
}

interface Episode {
  id: number;
  title: string;
  description: string;
  audioUrl: string; // Ensure you have this property
}

// Define genre mapping
const genreMapping: { [key: number]: string } = {
  1: "Comedy",
  2: "Drama",
  3: "Thriller", // Add other genre mappings here
  4: "Documentary",
  // Add more genres as needed
};

const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

const ShowList: React.FC = () => {
  const [shows, setShows] = useState<Show[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedShow, setSelectedShow] = useState<Show | null>(null);

  const placeholderAudioUrl = 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3';

  useEffect(() => {
    const fetchShows = async () => {
      try {
        const response = await fetch('https://podcast-api.netlify.app');
        if (!response.ok) throw new Error("Network response was not ok");
        const data: Show[] = await response.json();
        console.log(data); // Log the data to check the structure
        const sortedData = data.sort((a, b) => a.title.localeCompare(b.title));
        setShows(sortedData);
      } catch (error) {
        console.error('Error fetching shows:', error);
        setError("Failed to load shows.");
      } finally {
        setLoading(false);
      }
    };

    fetchShows();
  }, []);

  const fetchShowDetails = async (id: number) => {
    try {
      const response = await fetch(`https://podcast-api.netlify.app/id/${id}`);
      const show = await response.json();
      setSelectedShow(show); // Set the show with its seasons and episodes
    } catch (error) {
      console.error("Error fetching show details:", error);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h1>Available Shows</h1>
      <ul className="show-list">
        {shows.map((show) => (
          <li 
            key={show.id} 
            className="show-list-item" 
            onClick={() => fetchShowDetails(show.id)} // Fetch show details on click
          >
            <h2>{show.title}</h2>
            <p>{show.description}</p>
            <img src={show.image} alt={show.title} className="show-image" />
            <p className="genres">
              Genres: {show.genreIds && show.genreIds.length > 0 
                ? show.genreIds.map(id => genreMapping[id] || "Unknown genre").join(", ") 
                : "No genres available"}
            </p>
            <p className="last-updated">
              Last Updated: {formatDate(show.lastUpdated)} {/* Add this line */}
            </p>
            <EpisodePlayer 
              episodeTitle={`${show.title} - Sample Episode`}
              placeholderAudioUrl={placeholderAudioUrl} 
            />
          </li>
        ))}
      </ul>
  
      {/* Render SeasonEpisodes based on selectedShow */}
      {selectedShow && <SeasonEpisodes show={selectedShow} />}
    </div>
  );
};

export default ShowList;
