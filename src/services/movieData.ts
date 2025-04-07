
import { Movie } from "@/components/MovieCard.d";

// Featured movie for hero section
export const featuredMovie = {
  id: "1",
  title: "The Godfather",
  backdrop: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1920&q=80",
  description: "The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son. Spanning the years 1945 to 1955, the story chronicles the Corleone family under patriarch Vito Corleone, focusing on the transformation of his youngest son, Michael, from reluctant family outsider to ruthless mafia boss."
};

// Sample movie data
export const popularMovies: Movie[] = [
  {
    id: "1",
    title: "The Godfather",
    posterPath: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=500&h=750&q=80",
    releaseYear: "1972",
    rating: 9.2,
    genres: ["Crime", "Drama"]
  },
  {
    id: "2",
    title: "Interstellar",
    posterPath: "https://images.unsplash.com/photo-1470813740244-df37b8c1edcb?auto=format&fit=crop&w=500&h=750&q=80",
    releaseYear: "2014",
    rating: 8.6,
    genres: ["Adventure", "Drama", "Sci-Fi"]
  },
  {
    id: "3",
    title: "The Dark Knight",
    posterPath: "https://images.unsplash.com/photo-1500673922987-e212871fec22?auto=format&fit=crop&w=500&h=750&q=80",
    releaseYear: "2008",
    rating: 9.0,
    genres: ["Action", "Crime", "Drama"]
  },
  {
    id: "4",
    title: "Pulp Fiction",
    posterPath: "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=500&h=750&q=80",
    releaseYear: "1994",
    rating: 8.9,
    genres: ["Crime", "Drama"]
  },
  {
    id: "5",
    title: "Inception",
    posterPath: "https://images.unsplash.com/photo-1470813740244-df37b8c1edcb?auto=format&fit=crop&w=500&h=750&q=80",
    releaseYear: "2010",
    rating: 8.8,
    genres: ["Action", "Adventure", "Sci-Fi"]
  }
];

export const topRatedMovies: Movie[] = [
  {
    id: "6",
    title: "The Shawshank Redemption",
    posterPath: "https://images.unsplash.com/photo-1500673922987-e212871fec22?auto=format&fit=crop&w=500&h=750&q=80",
    releaseYear: "1994",
    rating: 9.3,
    genres: ["Drama"]
  },
  {
    id: "7",
    title: "The Lord of the Rings: The Return of the King",
    posterPath: "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=500&h=750&q=80",
    releaseYear: "2003",
    rating: 9.0,
    genres: ["Adventure", "Drama", "Fantasy"]
  },
  {
    id: "8",
    title: "Forrest Gump",
    posterPath: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=500&h=750&q=80",
    releaseYear: "1994",
    rating: 8.8,
    genres: ["Drama", "Romance"]
  },
  {
    id: "9",
    title: "Fight Club",
    posterPath: "https://images.unsplash.com/photo-1470813740244-df37b8c1edcb?auto=format&fit=crop&w=500&h=750&q=80",
    releaseYear: "1999",
    rating: 8.8,
    genres: ["Drama"]
  },
  {
    id: "10",
    title: "The Matrix",
    posterPath: "https://images.unsplash.com/photo-1500673922987-e212871fec22?auto=format&fit=crop&w=500&h=750&q=80",
    releaseYear: "1999",
    rating: 8.7,
    genres: ["Action", "Sci-Fi"]
  }
];

export const trendingMovies: Movie[] = [
  {
    id: "11",
    title: "Dune",
    posterPath: "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=500&h=750&q=80",
    releaseYear: "2021",
    rating: 8.0,
    genres: ["Adventure", "Drama", "Sci-Fi"]
  },
  {
    id: "12",
    title: "No Time to Die",
    posterPath: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=500&h=750&q=80",
    releaseYear: "2021",
    rating: 7.3,
    genres: ["Action", "Adventure", "Thriller"]
  },
  {
    id: "13",
    title: "The French Dispatch",
    posterPath: "https://images.unsplash.com/photo-1470813740244-df37b8c1edcb?auto=format&fit=crop&w=500&h=750&q=80",
    releaseYear: "2021",
    rating: 7.2,
    genres: ["Comedy", "Drama", "Romance"]
  },
  {
    id: "14",
    title: "Spider-Man: No Way Home",
    posterPath: "https://images.unsplash.com/photo-1500673922987-e212871fec22?auto=format&fit=crop&w=500&h=750&q=80",
    releaseYear: "2021",
    rating: 8.3,
    genres: ["Action", "Adventure", "Fantasy"]
  },
  {
    id: "15",
    title: "The Power of the Dog",
    posterPath: "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=500&h=750&q=80",
    releaseYear: "2021",
    rating: 6.9,
    genres: ["Drama", "Romance", "Western"]
  }
];

// Function to get movie by ID
export const getMovieById = (id: string): Movie | undefined => {
  const allMovies = [...popularMovies, ...topRatedMovies, ...trendingMovies];
  return allMovies.find(movie => movie.id === id);
};

// Function to search movies
export const searchMovies = (query: string): Movie[] => {
  const allMovies = [...popularMovies, ...topRatedMovies, ...trendingMovies];
  const lowerCaseQuery = query.toLowerCase();
  
  return allMovies.filter(movie => 
    movie.title.toLowerCase().includes(lowerCaseQuery) || 
    movie.genres.some(genre => genre.toLowerCase().includes(lowerCaseQuery))
  );
};

// Movie details (expanded data for movie detail page)
export const getMovieDetails = (id: string) => {
  const movie = getMovieById(id);
  
  if (!movie) return undefined;
  
  // Add additional details to the movie
  return {
    ...movie,
    director: "Francis Ford Coppola",
    cast: ["Marlon Brando", "Al Pacino", "James Caan"],
    runtime: "175 min",
    overview: "The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.",
    backdrop: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1920&q=80",
  };
};
