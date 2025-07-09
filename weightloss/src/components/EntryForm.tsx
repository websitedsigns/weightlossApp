import React from "react";

interface Props {
  weightInput: string;
  dateInput: string;
  setWeightInput: (val: string) => void;
  setDateInput: (val: string) => void;
  onAdd: () => void;
}

const EntryForm = ({
  weightInput,
  dateInput,
  setWeightInput,
  setDateInput,
  onAdd,
}: Props) => {
  return (
    <div className="row g-2 justify-content-center mb-4">
      <div className="col-auto">
        <input
          type="number"
          className="form-control"
          placeholder="Weight"
          value={weightInput}
          onChange={(e) => setWeightInput(e.target.value)}
        />
      </div>
      <div className="col-auto">
        <input
          type="date"
          className="form-control"
          value={dateInput}
          onChange={(e) => setDateInput(e.target.value)}
        />
      </div>
      <div className="col-auto">
        <button className="btn btn-success" onClick={onAdd}>
          Add Entry
        </button>
      </div>
    </div>
  );
};

export default EntryForm;
