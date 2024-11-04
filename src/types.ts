export interface Episode {
  id: number;
  title: string;
  description: string;
}

export interface Season {
  id: number;
  title: string;
  episodes: Episode[];
}

export interface Show {
  id: number;
  title: string;
  description: string;
  image: string;
  lastUpdated: string;
  seasons: Season[];
  genreIds: number[];
}

export interface Genre {
  id: number;
  title: string;
} 