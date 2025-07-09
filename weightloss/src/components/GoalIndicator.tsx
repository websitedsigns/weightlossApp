import React from "react";

interface Props {
  goalWeight: { value: string; unit: "kg" | "lbs" } | null;
  unit: "kg" | "lbs";
  currentWeight: number | undefined;
  toKg: (val: number) => number;
  toLbs: (val: number) => number;
}

const GoalIndicator = ({
  goalWeight,
  unit,
  currentWeight,
  toKg,
  toLbs,
}: Props) => {
  if (!goalWeight || currentWeight === undefined) return null;

  const goalVal = parseFloat(goalWeight.value);
  if (isNaN(goalVal)) return null;

  // Convert goal and current to same unit for comparison
  let goalInCurrentUnit =
    goalWeight.unit === unit
      ? goalVal
      : unit === "kg"
      ? toKg(goalVal)
      : toLbs(goalVal);

  let currentInCurrentUnit = currentWeight;

  const diff = (currentInCurrentUnit - goalInCurrentUnit).toFixed(1);

  return (
    <div className="alert alert-info my-3">
      🎯 Current Weight: {currentInCurrentUnit.toFixed(1)} {unit} — Goal Weight:{" "}
      {goalInCurrentUnit.toFixed(1)} {unit}
      <br />
      {diff > 0
        ? `You're ${diff} ${unit} above your goal. Keep going!`
        : `You've reached or passed your goal! 🎉`}
    </div>
  );
};

export default GoalIndicator;
