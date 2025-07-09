import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

type Entry = {
  id: number;
  weight: number;
  date: string;
};

const Stats = () => {
  const [entries, setEntries] = useState<Entry[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("weightEntries");
    if (stored) setEntries(JSON.parse(stored));
  }, []);

  if (!entries.length) return <p className="text-center">No data yet.</p>;

  const weights = entries.map((e) => e.weight);
  const avg = (weights.reduce((a, b) => a + b, 0) / weights.length).toFixed(1);
  const min = Math.min(...weights);
  const max = Math.max(...weights);

  return (
    <div className="container py-4">
      <h1>📊 Your Stats</h1>
      <ul className="list-group">
        <li className="list-group-item">Average Weight: {avg} kg</li>
        <li className="list-group-item">Lowest Weight: {min} kg</li>
        <li className="list-group-item">Highest Weight: {max} kg</li>
      </ul>
      <Link to="/" className="btn btn-link mt-3">
        ← Back to Home
      </Link>
    </div>
  );
};

export default Stats;
