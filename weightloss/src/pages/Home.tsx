import { useEffect, useState } from "react";
import GoalWeight from "../components/GoalWeight";
import GoalIndicator from "../components/GoalIndicator";
import EntryForm from "../components/EntryForm";
import EntryList from "../components/EntryList";
import WeightChart from "../components/WeightChart";

export type Entry = {
  id: number;
  weight: number;
  date: string;
};

const Home = () => {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [startingWeight, setStartingWeight] = useState<number | null>(null);
  const [weightInput, setWeightInput] = useState("");
  const [dateInput, setDateInput] = useState("");
  const [unit, setUnit] = useState<"kg" | "lbs">("kg");
  const [goal, setGoal] = useState<{ value: string; unit: "kg" | "lbs" } | null>(
    null
  );

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editWeight, setEditWeight] = useState("");
  const [editDate, setEditDate] = useState("");

  // Modal states for initial weight
  const [showInitialModal, setShowInitialModal] = useState(false);
  const [initialWeightInput, setInitialWeightInput] = useState("");
  const [initialDateInput, setInitialDateInput] = useState(
    new Date().toISOString().split("T")[0]
  );

  // Load entries and starting weight from localStorage
  useEffect(() => {
    const storedEntries = localStorage.getItem("weightEntries");
    if (storedEntries) {
      const parsedEntries: Entry[] = JSON.parse(storedEntries);
      setEntries(parsedEntries);
    }

    const storedStartWeight = localStorage.getItem("startingWeight");
    if (storedStartWeight) {
      setStartingWeight(parseFloat(storedStartWeight));
    }

    setDateInput(new Date().toISOString().split("T")[0]);
  }, []);

  // Show initial modal if no starting weight
  useEffect(() => {
    if (startingWeight === null) {
      setShowInitialModal(true);
    }
  }, [startingWeight]);

  // Save entries
  useEffect(() => {
    localStorage.setItem("weightEntries", JSON.stringify(entries));
  }, [entries]);

  // Save starting weight
  useEffect(() => {
    if (startingWeight !== null) {
      localStorage.setItem("startingWeight", startingWeight.toString());
    }
  }, [startingWeight]);

  // Conversion helpers
  const toKg = (val: number) => val / 2.20462;
  const toLbs = (val: number) => val * 2.20462;

  const getWeightInCurrentUnit = (weight: number) =>
    unit === "kg" ? toKg(weight) : toLbs(weight);

  // Average weekly weight lost using fixed startingWeight
  const averageWeeklyWeightLost = () => {
    if (entries.length < 2 || startingWeight === null) return "0";

    const sortedEntries = [...entries].sort((a, b) =>
      a.date.localeCompare(b.date)
    );

    const lastEntry = sortedEntries[sortedEntries.length - 1];
    const lastWeight = getWeightInCurrentUnit(lastEntry.weight);

    const startWeightConverted =
      unit === "kg" ? toKg(startingWeight) : toLbs(startingWeight);

    const totalLoss = startWeightConverted - lastWeight;

    const firstDate = new Date(sortedEntries[0].date);
    const lastDate = new Date(lastEntry.date);
    const msPerWeek = 1000 * 60 * 60 * 24 * 7;
    const weeksElapsed = Math.max(
      1,
      Math.round((lastDate.getTime() - firstDate.getTime()) / msPerWeek)
    );

    const avgWeeklyLoss = totalLoss / weeksElapsed;
    return avgWeeklyLoss.toFixed(2);
  };

  // Handle add new weight entry
  const handleAdd = () => {
    if (!weightInput || !dateInput) return;
    const newEntry: Entry = {
      id: Date.now(),
      weight: parseFloat(weightInput),
      date: dateInput,
    };
    setEntries([...entries, newEntry]);

    if (startingWeight === null) {
      setStartingWeight(newEntry.weight);
    }

    setWeightInput("");
    setDateInput(new Date().toISOString().split("T")[0]);
  };

  // Delete entry
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

  // Handle initial weight modal submit
  const handleInitialWeightSubmit = () => {
    if (!initialWeightInput || !initialDateInput) return;
    const weightNum = parseFloat(initialWeightInput);
    if (isNaN(weightNum)) return;

    setStartingWeight(weightNum);

    const newEntry: Entry = {
      id: Date.now(),
      weight: weightNum,
      date: initialDateInput,
    };
    setEntries([newEntry]);
    setShowInitialModal(false);
  };

  return (
    <>
      <div className="container py-4">
        {/* Initial Weight Modal */}
        {showInitialModal && (
          <div
            className="modal d-flex align-items-center justify-content-center"
            tabIndex={-1}
            style={{
              backgroundColor: "rgba(0,0,0,0.6)",
              position: "fixed",
              top: 0,
              left: 0,
              width: "100vw",
              height: "100vh",
              zIndex: 1050,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: 0,
            }}
          >
            <div
              className="modal-dialog"
              style={{
                maxWidth: 400,
                width: "90vw",
                margin: 0,
                borderRadius: 16,
                boxShadow: "0 8px 32px rgba(0,0,0,0.25)",
                background: "rgba(255,255,255,0.95)",
              }}
            >
              <div className="modal-content border-0" style={{ borderRadius: 16 }}>
                <div className="modal-header border-0" style={{ borderRadius: "16px 16px 0 0", background: "#f8fafc" }}>
                  <h5 className="modal-title w-100 text-center" style={{ fontWeight: 700, fontSize: 22 }}>
                    Enter Your Starting Weight
                  </h5>
                </div>
                <div className="modal-body">
                  <label htmlFor="initialWeight" className="form-label" style={{ fontWeight: 500 }}>
                    Weight ({unit}):
                  </label>
                  <input
                    type="number"
                    id="initialWeight"
                    className="form-control mb-3"
                    value={initialWeightInput}
                    onChange={(e) => setInitialWeightInput(e.target.value)}
                    min="0"
                    step="0.1"
                    style={{ fontSize: 18, borderRadius: 8, padding: "10px 12px" }}
                    autoFocus
                  />
                  <label htmlFor="initialDate" className="form-label mt-2" style={{ fontWeight: 500 }}>
                    Date:
                  </label>
                  <input
                    type="date"
                    id="initialDate"
                    className="form-control"
                    value={initialDateInput}
                    onChange={(e) => setInitialDateInput(e.target.value)}
                    max={new Date().toISOString().split("T")[0]}
                    style={{ fontSize: 18, borderRadius: 8, padding: "10px 12px" }}
                  />
                </div>
                <div className="modal-footer border-0 d-flex justify-content-center" style={{ borderRadius: "0 0 16px 16px", background: "#f8fafc" }}>
                  <button
                    className="btn btn-primary px-4 py-2"
                    style={{ borderRadius: 8, fontWeight: 600, fontSize: 18, minWidth: 120 }}
                    onClick={handleInitialWeightSubmit}
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

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

        {/* Average weekly weight lost */}
        <div className="mb-3 text-center">
          <h5>
            🏆 Average Weekly Weight Lost:{" "}
            <strong>
              {averageWeeklyWeightLost()} {unit}
            </strong>
          </h5>
        </div>

        {/* Goal Weight input/display */}
        <GoalWeight currentUnit={unit} savedGoal={goal} onGoalChange={setGoal} />

        {/* Add new weight entry form */}
        <EntryForm
          weightInput={weightInput}
          dateInput={dateInput}
          setWeightInput={setWeightInput}
          setDateInput={setDateInput}
          onAdd={handleAdd}
        />

        {/* Chart */}
        <WeightChart entries={entries} />

        {/* Goal progress indicator */}
        <GoalIndicator
          goalWeight={goal}
          unit={unit}
          currentWeight={entries.length ? entries[entries.length - 1].weight : undefined}
          toKg={toKg}
          toLbs={toLbs}
        />

        {/* Entry list with edit/delete */}
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
          convert={(w, to) => {
            const converted = to === "kg" ? toKg(w) : toLbs(w);
            return converted.toFixed(2);
          }}
        />
      </div>
    </>
  );
};

export default Home;
