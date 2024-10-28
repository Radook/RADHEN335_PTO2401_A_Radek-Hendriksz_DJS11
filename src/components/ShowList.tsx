// src/components/ShowList.tsx
import React, { useEffect, useState } from 'react';

interface Show {
  id: number;
  title: string;
  description: string;
  image: string; // Assuming there's an image property
}

const ShowList: React.FC = () => {
  const [shows, setShows] = useState<Show[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  
  useEffect(() => {
    const fetchShows = async () => {
      try {
        const response = await fetch('https://podcast-api.netlify.app');
        const data = await response.json();
        setShows(data);
      } catch (error) {
        console.error('Error fetching shows:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchShows();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Available Shows</h1>
      <ul>
        {shows.map((show) => (
          <li key={show.id}>
            <h2>{show.title}</h2>
            <p>{show.description}</p>
            <img src={show.image} alt={show.title} style={{ width: '100px' }} />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ShowList;
