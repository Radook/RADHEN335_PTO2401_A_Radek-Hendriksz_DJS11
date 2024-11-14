import React, { useState } from "react";

interface Season {
  season: number;
  title?: string;
  episodes: Episode[];
}

interface Episode {
  id: number;
  title: string;
  duration: number;
}

interface SeasonsProps {
  seasons: Season[];
  onSeasonChange: (season: number | null) => void;
}

const Seasons: React.FC<SeasonsProps> = ({ seasons, onSeasonChange }) => {
  const [selectedSeason, setSelectedSeason] = useState<number | null>(null);

  const handleSeasonChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const season = Number(event.target.value) || null;
    setSelectedSeason(season);
    onSeasonChange(season);
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
        <option value="">No Season Selected</option>
        {seasons.map((season) => (
          <option key={season.season} value={season.season}>
            {season.title ? `Season ${season.season} ` : `Season ${season.season}`}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Seasons;
