// src/components/EpisodePlayer.tsx
import React from 'react';

interface EpisodePlayerProps {
  episodeTitle: string;
  placeholderAudioUrl: string; // Placeholder audio URL for all episodes
}

const EpisodePlayer: React.FC<EpisodePlayerProps> = ({ episodeTitle, placeholderAudioUrl }) => {
  return (
    <div>
      <h4>{episodeTitle}</h4>
      <audio controls>
        <source src={placeholderAudioUrl} type="audio/mp3" />
        Your browser does not support the audio element.
      </audio>
    </div>
  );
};

export default EpisodePlayer;