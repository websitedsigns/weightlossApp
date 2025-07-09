import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

type WeightEntry = {
  id: number;
  weight: number;
  date: string;
};

const Home = () => {
  const [entries, setEntries] = useState<WeightEntry[]>([]);
  const [weightInput, setWeightInput] = useState("");
  const [dateInput, setDateInput] = useState("");
  const [unit, setUnit] = useState<"kg" | "lbs">("kg");

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editWeight, setEditWeight] = useState("");
  const [editDate, setEditDate] = useState("");

  // Convert between kg and lbs
  const convert = (weight: number, to: "kg" | "lbs") =>
    to === "lbs"
      ? (weight * 2.20462).toFixed(1)
      : (weight / 2.20462).toFixed(1);

  // Load from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("weightEntries");
    if (stored) setEntries(JSON.parse(stored));
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem("weightEntries", JSON.stringify(entries));
  }, [entries]);

  // Set today’s date as default
  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    setDateInput(today);
  }, []);

  const handleAdd = () => {
    if (!weightInput || !dateInput) {
      console.log("Missing input:", { weightInput, dateInput });
      return;
    }

    const newEntry: WeightEntry = {
      id: Date.now(),
      weight: parseFloat(weightInput),
      date: dateInput,
    };

    setEntries([...entries, newEntry]);
    setWeightInput("");
    setDateInput(new Date().toISOString().split("T")[0]);
  };

  const handleDelete = (id: number) => {
    setEntries(entries.filter((entry) => entry.id !== id));
  };

  const handleEditSave = () => {
    const updated = entries.map((e) =>
      e.id === editingId
        ? {
            ...e,
            weight: parseFloat(editWeight),
            date: editDate,
          }
        : e
    );
    setEntries(updated);
    setEditingId(null);
  };

  return (
    <div style={{ maxWidth: "600px", margin: "2rem auto", padding: "1rem" }}>
      <h1>Weightless Journey</h1>

      <button onClick={() => setUnit(unit === "kg" ? "lbs" : "kg")}>
        Switch to {unit === "kg" ? "lbs" : "kg"}
      </button>

      <div style={{ marginTop: "1rem" }}>
        <input
          type="number"
          placeholder="Enter weight"
          value={weightInput}
          onChange={(e) => setWeightInput(e.target.value)}
        />
        <input
          type="date"
          value={dateInput}
          onChange={(e) => setDateInput(e.target.value)}
        />
        <button onClick={handleAdd}>Add</button>
      </div>

      <h2 style={{ marginTop: "2rem" }}>Progress Chart</h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={entries}>
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="weight"
            stroke="#8884d8"
            dot={{ r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>

      <h2 style={{ marginTop: "2rem" }}>Your Entries</h2>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {entries.map((entry) => (
          <li key={entry.id} style={{ marginBottom: "1rem" }}>
            {editingId === entry.id ? (
              <>
                <input
                  type="number"
                  value={editWeight}
                  onChange={(e) => setEditWeight(e.target.value)}
                />
                <input
                  type="date"
                  value={editDate}
                  onChange={(e) => setEditDate(e.target.value)}
                />
                <button onClick={handleEditSave}>✅ Save</button>
                <button onClick={() => setEditingId(null)}>Cancel</button>
              </>
            ) : (
              <>
                {entry.date}:{" "}
                {unit === "kg"
                  ? `${entry.weight} kg`
                  : `${convert(entry.weight, "lbs")} lbs`}{" "}
                <button
                  onClick={() => {
                    setEditingId(entry.id);
                    setEditWeight(entry.weight.toString());
                    setEditDate(entry.date);
                  }}
                >
                  ✏️ Edit
                </button>
                <button onClick={() => handleDelete(entry.id)}>❌ Delete</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Home;
