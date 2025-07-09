import { useState, useEffect } from "react";

type Goal = {
  value: string;
  unit: "kg" | "lbs";
};

interface Props {
  currentUnit: "kg" | "lbs";
  onGoalChange: (goal: Goal | null) => void;
  savedGoal: Goal | null;
}

const GoalWeight = ({ currentUnit, onGoalChange, savedGoal }: Props) => {
  const [goal, setGoal] = useState<Goal | null>(savedGoal);
  const [inputGoalValue, setInputGoalValue] = useState(goal?.value || "");
  const [inputGoalUnit, setInputGoalUnit] = useState<"kg" | "lbs">(goal?.unit || currentUnit);

  useEffect(() => {
    setGoal(savedGoal);
    setInputGoalValue(savedGoal?.value || "");
    setInputGoalUnit(savedGoal?.unit || currentUnit);
  }, [savedGoal, currentUnit]);

  const toKg = (val: number) => val / 2.20462;
  const toLbs = (val: number) => val * 2.20462;

  const displayGoalValue = () => {
    if (!goal) return "";
    const val = parseFloat(goal.value);
    if (isNaN(val)) return "";

    if (goal.unit === currentUnit) {
      return val.toFixed(1);
    } else {
      return currentUnit === "kg" ? toKg(val).toFixed(1) : toLbs(val).toFixed(1);
    }
  };

  const saveGoal = () => {
    if (!inputGoalValue) return;
    setGoal({ value: inputGoalValue, unit: inputGoalUnit });
    onGoalChange({ value: inputGoalValue, unit: inputGoalUnit });
  };

  const editGoal = () => {
    setGoal(null);
    onGoalChange(null);
  };

  const deleteGoal = () => {
    if (confirm("Remove goal weight?")) {
      setGoal(null);
      setInputGoalValue("");
      onGoalChange(null);
    }
  };

  return (
    <>
      {!goal ? (
        <div className="mb-4">
          <label className="form-label">Set Goal Weight ({currentUnit})</label>
          <div className="d-flex gap-2 align-items-center">
            <input
              type="number"
              className="form-control"
              value={inputGoalValue}
              onChange={(e) => setInputGoalValue(e.target.value)}
              placeholder="e.g. 70"
            />
            <select
              className="form-select"
              value={inputGoalUnit}
              onChange={(e) => setInputGoalUnit(e.target.value as "kg" | "lbs")}
              style={{ maxWidth: "6rem" }}
            >
              <option value="kg">kg</option>
              <option value="lbs">lbs</option>
            </select>
            <button
              className="btn btn-primary"
              disabled={!inputGoalValue}
              onClick={saveGoal}
            >
              Save
            </button>
          </div>
        </div>
      ) : (
        <div className="card mb-4 shadow-sm">
          <div className="card-body d-flex justify-content-between align-items-center">
            <div>
              <strong>🎯 Goal:</strong> {displayGoalValue()} {currentUnit}
              <br />
              <small style={{ opacity: 0.7 }}>
                (Set as {goal.value} {goal.unit})
              </small>
            </div>
            <div className="d-flex gap-2">
              <button className="btn btn-sm btn-outline-secondary" onClick={editGoal}>
                ✏️ Edit
              </button>
              <button className="btn btn-sm btn-outline-danger" onClick={deleteGoal}>
                ❌ Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default GoalWeight;
