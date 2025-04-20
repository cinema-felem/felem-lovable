import { supabase } from "@/integrations/supabase/client";

export async function fetchMovieStats() {
  // Fetch all showings with movie information
  const { data: showings, error } = await supabase
    .from('Showtime')
    .select(`
      filmId,
      movieFormat,
      cinemaId,
      Movie (
        id,
        title,
        tmdbId
      )
    `);

  if (error) {
    console.error('Error fetching movie stats:', error);
    throw error;
  }

  // Process the data
  const movieStats = new Map();
  const movieShowingCounts = new Map();
  const movieCinemas = new Map();
  const movieFormats = new Map();
  const tmdbIds = new Set();

  showings.forEach((showing) => {
    const movieId = showing.filmId;
    const movieTitle = showing.Movie?.title;
    const tmdbId = showing.Movie?.tmdbId;

    if (!movieTitle) return;
    if (tmdbId) tmdbIds.add(tmdbId);

    // Count showings per movie
    movieShowingCounts.set(movieId, (movieShowingCounts.get(movieId) || 0) + 1);

    // Track unique cinemas per movie
    if (!movieCinemas.has(movieId)) {
      movieCinemas.set(movieId, new Set());
    }
    movieCinemas.get(movieId).add(showing.cinemaId);

    // Track formats per movie
    if (!movieFormats.has(movieId)) {
      movieFormats.set(movieId, new Set());
    }
    movieFormats.get(movieId).add(showing.movieFormat);

    // Store movie info
    movieStats.set(movieId, {
      id: movieId,
      title: movieTitle,
      tmdbId,
    });
  });

  // Fetch TMDB data for release dates and ratings
  const { data: tmdbData, error: tmdbError } = await supabase
    .from('tmdb')
    .select('id, release_date, ratings')
    .in('id', Array.from(tmdbIds));

  if (tmdbError) {
    console.error('Error fetching TMDB data:', tmdbError);
    throw tmdbError;
  }

  // Create a lookup map for TMDB data
  const tmdbLookup = new Map();
  tmdbData?.forEach(item => {
    tmdbLookup.set(item.id, {
      releaseDate: item.release_date,
      allRatings: item.ratings,
    });
  });

  // Transform data for components
  const movieStatsArray = Array.from(movieStats.entries()).map(([id, movie]: [string, any]) => {
    const tmdbInfo = movie.tmdbId ? tmdbLookup.get(movie.tmdbId) : null;
    
    return {
      ...movie,
      showingsCount: movieShowingCounts.get(id) || 0,
      uniqueCinemas: movieCinemas.get(id)?.size || 0,
      formats: Array.from(movieFormats.get(id) || []),
      releaseDate: tmdbInfo?.releaseDate,
      allRatings: tmdbInfo?.allRatings,
    };
  });

  // Sort by showing count
  movieStatsArray.sort((a, b) => b.showingsCount - a.showingsCount);

  // Calculate overview statistics
  const totalMovies = movieStatsArray.length;
  const totalShowings = showings.length;
  const averageShowingsPerMovie = totalShowings / totalMovies;
  const uniqueFormats = new Set(showings.map(s => s.movieFormat)).size;

  // Prepare chart data (top 10 movies by showing count)
  const showingCounts = movieStatsArray
    .slice(0, 10)
    .map(movie => ({
      title: movie.title,
      count: movie.showingsCount,
    }));

  return {
    movieStats: movieStatsArray,
    showingCounts,
    overview: {
      totalMovies,
      totalShowings,
      averageShowingsPerMovie,
      uniqueFormats,
    },
  };
}
