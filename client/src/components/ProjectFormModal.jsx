import { useState } from "react";

const COLORS = ["#3F6659", "#E2A33D", "#43586B", "#D96C5F", "#7A6B9E"];

export default function ProjectFormModal({ initial, onClose, onSubmit, submitting }) {
  const [name, setName] = useState(initial?.name || "");
  const [description, setDescription] = useState(initial?.description || "");
  const [color, setColor] = useState(initial?.color || COLORS[0]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSubmit({ name, description, color });
  };

  return (
    <div className="fixed inset-0 z-30 flex items-center justify-center bg-graphite/40 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-card border border-line bg-paper p-6 shadow-lifted"
      >
        <h2 className="font-display text-xl font-semibold text-graphite">
          {initial ? "Edit project" : "New project"}
        </h2>

        <label className="mt-5 block text-xs font-medium uppercase tracking-wide text-graphite/50">
          Name
        </label>
        <input
          autoFocus
          className="field-input mt-1"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Website Redesign"
        />

        <label className="mt-4 block text-xs font-medium uppercase tracking-wide text-graphite/50">
          Description
        </label>
        <textarea
          className="field-input mt-1"
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="What is this project about?"
        />

        <label className="mt-4 block text-xs font-medium uppercase tracking-wide text-graphite/50">
          Accent color
        </label>
        <div className="mt-2 flex gap-2">
          {COLORS.map((c) => (
            <button
              type="button"
              key={c}
              onClick={() => setColor(c)}
              className="h-7 w-7 rounded-full border-2"
              style={{
                backgroundColor: c,
                borderColor: color === c ? "#1B1F23" : "transparent",
              }}
            />
          ))}
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <button type="button" className="btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="btn-primary" disabled={submitting}>
            {submitting ? "Saving…" : initial ? "Save changes" : "Create project"}
          </button>
        </div>
      </form>
    </div>
  );
}
