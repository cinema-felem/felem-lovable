
import { supabase } from "@/integrations/supabase/client";

interface FeaturedMovie {
  id: number;
  title: string;
  tmdbTitle?: string;
  backdrop: string;
  description: string;
}

export async function fetchFeaturedMovie(): Promise<FeaturedMovie> {
  const { data, error } = await supabase
    .from('tmdb')
    .select('id, title, image, overview')
    .order('ratings->tmdb', { ascending: false })
    .limit(1)
    .single();

  if (error || !data) {
    console.error('Error fetching featured movie:', error);
    return {
      id: 1,
      title: "The Godfather",
      backdrop: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1920&q=80",
      description: "The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son."
    };
  }

  const image = data.image as {backdrop_path?: string} | null;

  return {
    id: data.id,
    title: data.title,
    tmdbTitle: data.title,
    backdrop: image?.backdrop_path 
      ? `https://image.tmdb.org/t/p/original${image.backdrop_path}` 
      : "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1920&q=80",
    description: data.overview || "No description available"
  };
}
