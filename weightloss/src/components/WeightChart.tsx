import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

type Entry = {
  weight: number;
  date: string;
};

const WeightChart = ({ entries }: { entries: Entry[] }) => (
  <div className="mb-5">
    <h4 className="text-center mb-3">Progress Chart</h4>
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={entries}>
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="weight" stroke="#0d6efd" dot={{ r: 4 }} />
      </LineChart>
    </ResponsiveContainer>
  </div>
);

export default WeightChart;
