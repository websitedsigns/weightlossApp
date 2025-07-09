
interface Props {
  goalWeight: string;
  unit: "kg" | "lbs";
  currentWeight: number | undefined;
  convert: (w: number, to: "kg" | "lbs") => string;
}

const GoalIndicator = ({ goalWeight, unit, currentWeight, convert }: Props) => {
  if (!goalWeight || currentWeight === undefined) return null;

  const diff = Math.abs(
    (unit === "kg"
      ? currentWeight
      : parseFloat(convert(currentWeight, "lbs"))) - parseFloat(goalWeight)
  ).toFixed(1);

  return (
    <div className="alert alert-info">
      Current:{" "}
      {unit === "kg"
        ? `${currentWeight} kg`
        : `${convert(currentWeight, "lbs")} lbs`}
      {" — "}
      Goal: {goalWeight} {unit}
      <br />
      You are {diff} {unit} away from your goal.
      
    </div>
  );
};

export default GoalIndicator;
