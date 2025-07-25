"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface iAppProps {
  data: {
    date: string;
    amount: number;
  }[];
}

export function Graph({ data }: iAppProps) {
  if (!data || data.length === 0) return <div>No data to display</div>;

  return (
    <div style={{ minHeight: 300 }}>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip
            formatter={(value: number) => [`₱${value.toFixed(2)}`, "Amount"]}
            labelFormatter={(label: string) => `Date: ${label}`}
          />
          <Line
            type="monotone"
            dataKey="amount"
            stroke="#000000"
            strokeWidth={2}
            dot={{ r: 4, stroke: "#000000", fill: "#000000" }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

