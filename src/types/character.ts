export interface Character {
  id: number;
  name: string;
  ki: string;
  maxKi: string;
  race: string;
  gender: string;
  description: string;
  image: string;
  affiliation: string;
  deletedAt?: string | null;
}

export interface CharacterApiResponse {
  items: Character[];
  meta: {
    totalItems: number;
    itemCount: number;
    itemsPerPage: number;
    totalPages: number;
    currentPage: number;
  };
  links?: {
    first?: string;
    previous?: string;
    next?: string;
    last?: string;
  };
}

export type SortField = 'name' | 'ki';
export type SortOrder = 'asc' | 'desc';

export interface FilterState {
  gender: string;
  race: string;
  affiliation: string;
}
