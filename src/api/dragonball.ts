import axios from 'axios';
import type { Character, CharacterApiResponse } from '../types/character';
import mockCharactersData from './mockCharacters.json';

const BASE_URL = 'https://dragonball-api.com/api';

const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
});

const fallbackCharacters = mockCharactersData as Character[];

export async function fetchAllCharacters(): Promise<Character[]> {
  try {
    const response = await apiClient.get<CharacterApiResponse>('/characters', {
      params: { limit: 100 },
    });
    if (response.data && Array.isArray(response.data.items)) {
      return response.data.items;
    }
    return fallbackCharacters;
  } catch (error) {
    console.warn('External Dragon Ball API unreachable, using resilient fallback data:', error);
    return fallbackCharacters;
  }
}

export async function fetchCharacterById(id: number): Promise<Character | null> {
  try {
    const response = await apiClient.get<Character>(`/characters/${id}`);
    if (response.data && response.data.id) {
      return response.data;
    }
  } catch (error) {
    console.warn(`Could not fetch character #${id} from API, checking fallback data:`, error);
  }

  const found = fallbackCharacters.find((c) => c.id === id);
  return found || null;
}

export async function searchCharactersByName(name: string): Promise<Character[]> {
  try {
    const response = await apiClient.get<Character[] | CharacterApiResponse>('/characters', {
      params: { name: name.trim() },
    });
    if (Array.isArray(response.data)) {
      return response.data;
    }
    if (response.data && Array.isArray((response.data as CharacterApiResponse).items)) {
      return (response.data as CharacterApiResponse).items;
    }
  } catch (error) {
    console.warn(`Search for "${name}" via API failed, filtering fallback data:`, error);
  }

  const q = name.trim().toLowerCase();
  return fallbackCharacters.filter((c) => c.name.toLowerCase().includes(q));
}
