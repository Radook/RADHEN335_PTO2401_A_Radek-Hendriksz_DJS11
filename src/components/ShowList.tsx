import React, { useEffect, useState } from 'react';
import Modal from './Modal';
import './ShowList.css';
import { Show } from '../types';

const ShowList: React.FC = () => {
  const [shows, setShows] = useState<Show[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedShow, setSelectedShow] = useState<Show | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [seasonCounts, setSeasonCounts] = useState<{ [key: number]: number }>({});

  useEffect(() => {
    const fetchShows = async () => {
      try {
        const response = await fetch('https://podcast-api.netlify.app');
        if (!response.ok) throw new Error("Network response was not ok");
        const data: Show[] = await response.json();

        // Sort shows alphabetically by title before setting state
        const sortedData = data.sort((a, b) => a.title.localeCompare(b.title));
        setShows(sortedData);

        // Fetch season counts for each show
        await Promise.all(
          sortedData.map(async (show) => {
            const showResponse = await fetch(`https://podcast-api.netlify.app/id/${show.id}`);
            const showDetails = await showResponse.json();
            setSeasonCounts((prev) => ({ ...prev, [show.id]: showDetails.seasons.length }));
            // Attach the seasons directly to the show object
            show.seasons = showDetails.seasons; // Adding seasons to the show object
          })
        );
      } catch (error) {
        console.error("Error fetching shows:", error);
        setError("Failed to load shows.");
      } finally {
        setLoading(false);
      }
    };

    fetchShows();
  }, []);

  const handleShowSelect = (show: Show) => {
    setSelectedShow(show);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedShow(null);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h1>Available Shows</h1>
      <ul className="show-list">
        {shows.map((show) => (
          <li key={show.id} className="show-list-item">
            <img src={show.image} alt={show.title} className="show-image" />
            <h2>{show.title}</h2>
            <p className="show-description">{show.description}</p>
            <p>Seasons: {seasonCounts[show.id] ?? 0}</p>
            <button className="season-button" onClick={() => handleShowSelect(show)}>
              View Seasons
            </button>
          </li>
        ))}
      </ul>

      {/* Modal Component */}
      {isModalOpen && selectedShow && (
        <Modal
          show={isModalOpen}
          onClose={handleCloseModal}
          showData={selectedShow} // Pass the selected show data
        />
      )}
    </div>
  );
};

export default ShowList;
