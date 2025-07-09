import { useEffect, useState } from "react";
import EntryForm from "../components/EntryForm";
import EntryList from "../components/EntryList";
import WeightChart from "../components/WeightChart";
import GoalIndicator from "../components/GoalIndicator";

export type Entry = {
  id: number;
  weight: number;
  date: string;
};

const Home = () => {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [weightInput, setWeightInput] = useState("");
  const [dateInput, setDateInput] = useState("");
  const [unit, setUnit] = useState<"kg" | "lbs">("kg");

  // Goal weight split into saved goal and input for typing
  const [goalWeight, setGoalWeight] = useState("");
  const [inputGoalWeight, setInputGoalWeight] = useState("");

  // Editing entry states
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editWeight, setEditWeight] = useState("");
  const [editDate, setEditDate] = useState("");

  // Conversion between kg and lbs
  const convert = (weight: number, to: "kg" | "lbs") =>
    to === "lbs"
      ? (weight * 2.20462).toFixed(1)
      : (weight / 2.20462).toFixed(1);

  // Load entries from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("weightEntries");
    if (stored) setEntries(JSON.parse(stored));
    setDateInput(new Date().toISOString().split("T")[0]);
  }, []);

  // Save entries to localStorage when changed
  useEffect(() => {
    localStorage.setItem("weightEntries", JSON.stringify(entries));
  }, [entries]);

  // Add new entry
  const handleAdd = () => {
    if (!weightInput || !dateInput) return;
    const newEntry: Entry = {
      id: Date.now(),
      weight: parseFloat(weightInput),
      date: dateInput,
    };
    setEntries([...entries, newEntry]);
    setWeightInput("");
    setDateInput(new Date().toISOString().split("T")[0]);
  };

  // Delete entry by id
  const handleDelete = (id: number) => {
    setEntries(entries.filter((e) => e.id !== id));
  };

  // Save edited entry
  const handleEditSave = (id: number, weight: number, date: string) => {
    const updated = entries.map((e) =>
      e.id === id ? { ...e, weight, date } : e
    );
    setEntries(updated);
    setEditingId(null);
  };

  return (
    <div className="container py-4">
      <h1 className="text-center mb-4">Weightless Journey</h1>

      {/* Unit toggle */}
      <div className="text-center mb-3">
        <button
          className="btn btn-outline-primary"
          onClick={() => setUnit(unit === "kg" ? "lbs" : "kg")}
        >
          Switch to {unit === "kg" ? "lbs" : "kg"}
        </button>
      </div>

      {/* Goal Weight Input / Display */}
      {!goalWeight ? (
        <div className="mb-4">
          <label className="form-label">Set Goal Weight ({unit})</label>
          <div className="d-flex gap-2">
            <input
              type="number"
              className="form-control"
              value={inputGoalWeight}
              onChange={(e) => setInputGoalWeight(e.target.value)}
              placeholder={`e.g. 70`}
            />
            <button
              className="btn btn-primary"
              disabled={!inputGoalWeight}
              onClick={() => setGoalWeight(inputGoalWeight)}
            >
              Save
            </button>
          </div>
        </div>
      ) : (
        <div className="card mb-4 shadow-sm">
          <div className="card-body d-flex justify-content-between align-items-center">
            <div>
              <strong>🎯 Goal:</strong> {goalWeight} {unit}
            </div>
            <div className="d-flex gap-2">
              <button
                className="btn btn-sm btn-outline-secondary"
                onClick={() => {
                  setInputGoalWeight(goalWeight);
                  setGoalWeight("");
                }}
              >
                ✏️ Edit
              </button>
              <button
                className="btn btn-sm btn-outline-danger"
                onClick={() => {
                  if (confirm("Remove goal weight?")) {
                    setGoalWeight("");
                    setInputGoalWeight("");
                  }
                }}
              >
                ❌ Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add new weight entry */}
      <EntryForm
        weightInput={weightInput}
        dateInput={dateInput}
        setWeightInput={setWeightInput}
        setDateInput={setDateInput}
        onAdd={handleAdd}
      />

      {/* Chart */}
      <WeightChart entries={entries} />

      {/* Goal progress */}
      <GoalIndicator
        goalWeight={goalWeight}
        unit={unit}
        currentWeight={entries.at(-1)?.weight}
        convert={convert}
      />

      {/* List with edit/delete */}
      <EntryList
        entries={entries}
        unit={unit}
        onDelete={handleDelete}
        onEdit={handleEditSave}
        editingId={editingId}
        setEditingId={setEditingId}
        editWeight={editWeight}
        editDate={editDate}
        setEditWeight={setEditWeight}
        setEditDate={setEditDate}
        convert={convert}
      />
    </div>
  );
};

export default Home;
