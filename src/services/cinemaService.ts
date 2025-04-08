
import { supabase } from "@/integrations/supabase/client";
import { Cinema } from "./types";

/**
 * Fetch a single cinema by ID
 */
export async function fetchCinemaById(id: string): Promise<Cinema | null> {
  try {
    const { data, error } = await supabase
      .from('Cinema')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error('Error fetching cinema by ID:', error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Error in fetchCinemaById:', error);
    return null;
  }
}

/**
 * Fetch all cinemas
 */
export async function fetchAllCinemas(): Promise<Cinema[]> {
  try {
    const { data, error } = await supabase
      .from('Cinema')
      .select('*')
      .order('name');
    
    if (error) {
      console.error('Error fetching all cinemas:', error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error('Error in fetchAllCinemas:', error);
    return [];
  }
}
