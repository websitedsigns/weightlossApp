import React, { useEffect, useState } from "react";

type WeightEntry = {
  id: number;
  weight: number;
  date: string;
};

const Home = () => {
  const [entries, setEntries] = useState<WeightEntry[]>([]);
  const [weightInput, setWeightInput] = useState("");
  const [dateInput, setDateInput] = useState("");

  // Load from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("weightEntries");
    if (stored) setEntries(JSON.parse(stored));
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem("weightEntries", JSON.stringify(entries));
  }, [entries]);

  const handleAdd = () => {
    if (!weightInput || !dateInput) return;

    const newEntry: WeightEntry = {
      id: Date.now(),
      weight: parseFloat(weightInput),
      date: dateInput,
    };

    setEntries([...entries, newEntry]);
    setWeightInput("");
    setDateInput("");
  };

  const handleDelete = (id: number) => {
    setEntries(entries.filter((entry) => entry.id !== id));
  };

  return (
    <div>
      <h1>Weight Tracker</h1>
      <input
        type="number"
        placeholder="Weight"
        value={weightInput}
        onChange={(e) => setWeightInput(e.target.value)}
      />
      <input
        type="date"
        value={dateInput}
        onChange={(e) => setDateInput(e.target.value)}
      />
      <button onClick={handleAdd}>Add Entry</button>

      <ul>
        {entries.map((entry) => (
          <li key={entry.id}>
            {entry.date}: {entry.weight} kg{" "}
            <button onClick={() => handleDelete(entry.id)}>❌</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Home;
