
import { supabase } from "@/integrations/supabase/client";

export interface TmdbMovie {
  id: number;
  title: string;
  image?: {
    poster_path?: string;
  };
}

/**
 * Fetch TMDB data by IDs
 */
export async function fetchTmdbDataByIds(tmdbIds: number[]): Promise<Map<number, TmdbMovie>> {
  if (!tmdbIds.length) return new Map();

  try {
    const { data, error } = await supabase
      .from('tmdb')
      .select('id, title, image')
      .in('id', tmdbIds);
    
    if (error) {
      console.error('Error fetching TMDB data:', error);
      return new Map();
    }
    
    // Create a lookup map for easy access
    const tmdbLookup = new Map<number, TmdbMovie>();
    data?.forEach(item => {
      tmdbLookup.set(item.id, item);
    });
    
    return tmdbLookup;
  } catch (error) {
    console.error('Error in fetchTmdbDataByIds:', error);
    return new Map();
  }
}

/**
 * Get poster URL from TMDB data
 */
export function getTmdbPosterUrl(posterPath?: string): string {
  if (!posterPath) {
    return "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=500&h=750&q=80";
  }
  return `https://image.tmdb.org/t/p/w500${posterPath}`;
}

/**
 * Fetch TMDB titles by IDs
 */
export async function fetchTmdbTitlesByIds(tmdbIds: number[]): Promise<Map<number, string>> {
  if (!tmdbIds.length) return new Map();

  try {
    const { data, error } = await supabase
      .from('tmdb')
      .select('id, title')
      .in('id', tmdbIds);
    
    if (error) {
      console.error('Error fetching TMDB titles:', error);
      return new Map();
    }
    
    // Create a lookup map for easy access
    const tmdbTitlesMap = new Map<number, string>();
    data?.forEach(item => {
      tmdbTitlesMap.set(item.id, item.title);
    });
    
    return tmdbTitlesMap;
  } catch (error) {
    console.error('Error in fetchTmdbTitlesByIds:', error);
    return new Map();
  }
}
