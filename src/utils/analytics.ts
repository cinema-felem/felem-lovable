
// Utility functions for Google Analytics event tracking

/**
 * Send a page view event to Google Analytics
 * @param path - The page path (e.g., '/movie/123')
 * @param title - The page title
 */
export const logPageView = (path: string, title: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'page_view', {
      page_path: path,
      page_title: title,
      send_to: 'G-EJ3E57L04J'
    });
    console.log(`📊 GA Page View: ${path}`);
  }
};

/**
 * Send a custom event to Google Analytics
 * @param eventName - The name of the event
 * @param eventParams - Additional parameters for the event
 */
export const logEvent = (eventName: string, eventParams?: Record<string, any>) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, eventParams);
    console.log(`📊 GA Event: ${eventName}`, eventParams);
  }
};

/**
 * Track when a user views a movie details page
 * @param movieId - The ID of the movie
 * @param movieTitle - The title of the movie
 */
export const logMovieView = (movieId: string, movieTitle: string) => {
  logEvent('view_movie', {
    movie_id: movieId,
    movie_title: movieTitle
  });
};

/**
 * Track when a user interacts with a cinema
 * @param cinemaId - The ID of the cinema
 * @param cinemaName - The name of the cinema
 */
export const logCinemaView = (cinemaId: string, cinemaName: string) => {
  logEvent('view_cinema', {
    cinema_id: cinemaId,
    cinema_name: cinemaName
  });
};

/**
 * Track when a user interacts with a showtime listing
 * @param movieId - The ID of the movie
 * @param movieTitle - The title of the movie
 * @param cinemaId - The ID of the cinema
 * @param cinemaName - The name of the cinema
 */
export const logShowtimeInteraction = (
  movieId: string, 
  movieTitle: string, 
  cinemaId: string, 
  cinemaName: string
) => {
  logEvent('showtime_interaction', {
    movie_id: movieId,
    movie_title: movieTitle,
    cinema_id: cinemaId,
    cinema_name: cinemaName
  });
};
