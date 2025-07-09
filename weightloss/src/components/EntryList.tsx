
type Entry = {
  id: number;
  weight: number;
  date: string;
};

interface Props {
  entries: Entry[];
  unit: "kg" | "lbs";
  onDelete: (id: number) => void;
  onEdit: (id: number, weight: number, date: string) => void;
  editingId: number | null;
  setEditingId: (id: number | null) => void;
  editWeight: string;
  editDate: string;
  setEditWeight: (val: string) => void;
  setEditDate: (val: string) => void;
  convert: (w: number, to: "kg" | "lbs") => string;
}

const EntryList = ({
  entries,
  unit,
  onDelete,
  onEdit,
  editingId,
  setEditingId,
  editWeight,
  editDate,
  setEditWeight,
  setEditDate,
  convert,
}: Props) => {
  return (
    <ul className="list-group">
      {entries.map((entry) => (
        <li
          key={entry.id}
          className="list-group-item d-flex justify-content-between align-items-center"
        >
          {editingId === entry.id ? (
            <div className="d-flex flex-wrap gap-2 align-items-center w-100">
              <input
                type="number"
                className="form-control"
                value={editWeight}
                onChange={(e) => setEditWeight(e.target.value)}
              />
              <input
                type="date"
                className="form-control"
                value={editDate}
                onChange={(e) => setEditDate(e.target.value)}
              />
              <button
                className="btn btn-primary"
                onClick={() =>
                  onEdit(entry.id, parseFloat(editWeight), editDate)
                }
              >
                ✅ Save
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => setEditingId(null)}
              >
                Cancel
              </button>
            </div>
          ) : (
            <>
              <span>
                {entry.date}:{" "}
                {unit === "kg"
                  ? `${entry.weight} kg`
                  : `${convert(entry.weight, "lbs")} lbs`}
              </span>
              <div>
                <button
                  className="btn btn-sm btn-outline-primary me-2"
                  onClick={() => {
                    setEditingId(entry.id);
                    setEditWeight(entry.weight.toString());
                    setEditDate(entry.date);
                  }}
                >
                  ✏️
                  <span className="ms-1" title="Edit entry">
                    Edit
                  </span>
                </button>
                <button
                  className="btn btn-sm btn-outline-danger"
                  onClick={() => onDelete(entry.id)}
                >
                  ❌
                  <span className="ms-1" title="Delete entry">
                    Delete
                  </span>
                </button>
              </div>
            </>
          )}
        </li>
      ))}
    </ul>
  );
};

export default EntryList;
