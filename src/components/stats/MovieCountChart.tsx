
import { Bar, BarChart, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";

interface MovieCountData {
  title: string;
  count: number;
}

interface MovieCountChartProps {
  data: MovieCountData[];
}

export function MovieCountChart({ data }: MovieCountChartProps) {
  const chartConfig = {
    count: {
      label: "Showings",
      theme: {
        light: "#8B5CF6",
        dark: "#A78BFA",
      },
    },
  };

  return (
    <div className="rounded-lg border bg-card p-6">
      <h2 className="text-2xl font-semibold mb-4">Movies by Number of Showings</h2>
      <div className="h-[400px]">
        <ChartContainer config={chartConfig}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <XAxis 
                dataKey="title"
                tick={{ fontSize: 12 }}
                interval={0}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis />
              <ChartTooltip />
              <Bar dataKey="count" fill="var(--color-count)" />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>
    </div>
  );
}
