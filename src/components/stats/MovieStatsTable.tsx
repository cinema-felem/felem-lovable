
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Link } from "react-router-dom";
import { calculateMedianRating } from "@/utils/ratingUtils";

interface MovieStats {
  id: string;
  title: string;
  showingsCount: number;
  uniqueCinemas: number;
  formats: string[];
  releaseDate?: string;
  allRatings?: { source: string; rating: number; votes?: number }[];
}

interface MovieStatsTableProps {
  data: MovieStats[];
}

export function MovieStatsTable({ data }: MovieStatsTableProps) {
  return (
    <div className="rounded-lg border bg-card p-6">
      <h2 className="text-2xl font-semibold mb-4">Detailed Movie Statistics</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Movie</TableHead>
            <TableHead>Release Date</TableHead>
            <TableHead>Rating</TableHead>
            <TableHead>Total Showings</TableHead>
            <TableHead>Unique Cinemas</TableHead>
            <TableHead>Available Formats</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((movie) => {
            const medianRating = movie.allRatings 
              ? calculateMedianRating(movie.allRatings.map(r => r.rating))
              : null;

            const formattedDate = movie.releaseDate 
              ? new Date(movie.releaseDate).toLocaleDateString()
              : 'N/A';

            return (
              <TableRow key={movie.id}>
                <TableCell>
                  <Link 
                    to={`/movie/${movie.id}`}
                    className="text-cinema-gold hover:text-cinema-gold/80 transition-colors"
                  >
                    {movie.title}
                  </Link>
                </TableCell>
                <TableCell>{formattedDate}</TableCell>
                <TableCell>
                  {medianRating ? medianRating.toFixed(1) : 'N/A'}
                </TableCell>
                <TableCell>{movie.showingsCount}</TableCell>
                <TableCell>{movie.uniqueCinemas}</TableCell>
                <TableCell>{movie.formats.join(", ")}</TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  );
}
