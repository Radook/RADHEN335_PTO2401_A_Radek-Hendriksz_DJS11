import React, { useState } from 'react';
import './SeasonEpisodes.css'; // Import the CSS file

interface Episode {
  id: number;
  title: string;
  description: string;
  audioUrl: string; // Ensure this property exists
}

interface Season {
  id: number;
  title: string;
  episodes: Episode[];
}

interface Show {
  title: string;
  seasons: Season[];
}

interface SeasonEpisodesProps {
  show: Show;
}

const SeasonEpisodes: React.FC<SeasonEpisodesProps> = ({ show }) => {
  const [selectedSeasonId, setSelectedSeasonId] = useState<number | null>(null);

  return (
    <div className="season-episodes">
      <h2>{show.title} - Seasons</h2>
      {show.seasons && show.seasons.length > 0 ? (
        <div>
          <h3>Select a Season:</h3>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {show.seasons.map((season) => (
              <div
                key={season.id}
                className={`season ${selectedSeasonId === season.id ? 'selected' : ''}`}
                onClick={() => setSelectedSeasonId(season.id)}
              >
                {season.title}
              </div>
            ))}
          </div>

          {selectedSeasonId && (
            <div>
              <h4>Episodes for Selected Season:</h4>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                {show.seasons.find(season => season.id === selectedSeasonId)?.episodes.map((episode) => (
                  <div
                    key={episode.id}
                    className="episode"
                    onClick={() => {
                      const audio = new Audio(episode.audioUrl);
                      audio.play();
                    }}
                  >
                    <h5>{episode.title}</h5>
                    <p>{episode.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <p>No seasons available for this show.</p>
      )}
    </div>
  );
};

export default SeasonEpisodes;
