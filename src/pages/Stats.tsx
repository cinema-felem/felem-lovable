
import { useQuery } from "@tanstack/react-query";
import { fetchMovieStats } from "@/services/statsService";
import { MovieCountChart } from "@/components/stats/MovieCountChart";
import { MovieStatsTable } from "@/components/stats/MovieStatsTable";
import { StatsOverview } from "@/components/stats/StatsOverview";
import { Skeleton } from "@/components/ui/skeleton";

export default function Stats() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['movieStats'],
    queryFn: fetchMovieStats,
  });

  if (isLoading) {
    return <div className="container mx-auto p-8 space-y-8">
      <Skeleton className="h-[400px] w-full" />
      <Skeleton className="h-[300px] w-full" />
    </div>;
  }

  return (
    <div className="container mx-auto p-8 space-y-8">
      <h1 className="text-3xl font-bold text-cinema-gold">Movie Statistics</h1>
      
      {stats && (
        <>
          <StatsOverview stats={stats.overview} />
          <MovieCountChart data={stats.showingCounts} />
          <MovieStatsTable data={stats.movieStats} />
        </>
      )}
    </div>
  );
}
