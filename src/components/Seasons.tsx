import React, { useState } from "react";

// Define the structure for Season and Episode
interface Season {
  season: number;
  title?: string;
  episodes: Episode[]; // List of episodes for this season
}

interface Episode {
  id: number; // Unique ID for the episode
  title: string; // Title of the episode
}

// Define the props expected by the Seasons component
interface SeasonsProps {
  seasons: Season[]; // Array of season data
  onSeasonChange: (season: number | null) => void; // Callback function when the selected season changes
}

const Seasons: React.FC<SeasonsProps> = ({ seasons, onSeasonChange }) => {
  // State to store the selected season
  const [selectedSeason, setSelectedSeason] = useState<number | null>(null);

  // Handle the change of season selection from the dropdown
  const handleSeasonChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    // Get the selected season number from the dropdown
    const season = Number(event.target.value) || null; // If empty, set to null
    setSelectedSeason(season); // Update the state with the selected season
    onSeasonChange(season); // Call the parent component's callback function with the selected season
  };
  
  return (
    <div className="season-dropdown">
      {/* Label for the season selection dropdown */}
      <label htmlFor="season-select">Select Season:</label>

      {/* Dropdown for selecting a season */}
      <select
        id="season-select" // ID for the select element
        value={selectedSeason || ""} // Set the value of the dropdown to the selected season or empty string
        onChange={handleSeasonChange} // Handle change event when a new season is selected
      >

        {/* Map over the seasons array to create options for each season */}
        {seasons.map((season) => (
          <option key={season.season} value={season.season}>
            {/* Display the season number and title if available */}
            {season.title ? `Season ${season.season} - ${season.title}` : `Season ${season.season}`}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Seasons;
