import React, { useEffect, useState } from 'react';
import { Show, Episode } from '../types';
import Modal from './Modal'; // Import the Modal component

const SeasonEpisodes: React.FC<{ showId: number; onBack: () => void; }> = ({ showId, onBack }) => {
  const [showData, setShowData] = useState<Show | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedEpisode, setSelectedEpisode] = useState<Episode | null>(null); // State to hold the selected episode
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  useEffect(() => {
    const fetchShowData = async () => {
      setLoading(true);
      try {
        const response = await fetch(`https://podcast-api.netlify.app/id/${showId}`);
        if (!response.ok) throw new Error("Network response was not ok");
        const data: Show = await response.json();
        setShowData(data);
      } catch (error) {
        console.error(error); // Log the error to the console
        setError("Failed to load show data.");
      } finally {
        setLoading(false);
      }
    };

    fetchShowData();
  }, [showId]);

  const handleEpisodeSelect = (episode: Episode) => {
    setSelectedEpisode(episode);
    setModalVisible(true);
  };

  if (loading) return <div>Loading show data...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h2>{showData?.title}</h2>
      <img src={showData?.image} alt={showData?.title} />
      <h3>Episodes</h3>
      <ul>
        {showData?.seasons.flatMap(season => season.episodes).map(episode => (
          <li key={episode.id} onClick={() => handleEpisodeSelect(episode)}>
            <h4>{episode.title}</h4>
            <p>{episode.description}</p>
          </li>
        ))}
      </ul>
      <button onClick={onBack}>Back to Show List</button>

      {/* Render the Modal for the selected episode */}
      {modalVisible && selectedEpisode && showData && (
        <Modal 
          show={modalVisible} 
          onClose={() => setModalVisible(false)} 
          showData={showData} 
        />
      )}
    </div>
  );
};

export default SeasonEpisodes;
