import { useState } from "react";

export default function TaskModal({ task, members, onClose, onSave, onDelete, saving, error = "", readOnly = false }) {
  const [title, setTitle] = useState(task?.title || "");
  const [description, setDescription] = useState(task?.description || "");
  const [status, setStatus] = useState(task?.status || "todo");
  const [priority, setPriority] = useState(task?.priority || "medium");
  const [assignee, setAssignee] = useState(task?.assignee?._id || "");
  const [dueDate, setDueDate] = useState(
    task?.dueDate ? new Date(task.dueDate).toISOString().slice(0, 10) : ""
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    if (readOnly) {
      // Contributor can only update status
      onSave({ status });
      return;
    }
    onSave({
      title,
      description,
      status,
      priority,
      assignee: assignee || null,
      dueDate: dueDate || null,
    });
  };

  return (
    <div className="fixed inset-0 z-30 flex items-center justify-center bg-graphite/40 px-4 backdrop-blur-sm">
      <form
        onSubmit={handleSubmit}
        className="stub-card w-full max-w-lg p-6 shadow-lifted bg-white"
      >
        <div className="flex items-center justify-between">
          <span className="tag-eyebrow">{task ? `Task #${task._id.slice(-5)}` : "New task"}</span>
          {task && !readOnly && (
            <button
              type="button"
              onClick={() => onDelete(task._id)}
              className="text-xs font-medium text-coral hover:underline"
            >
              Delete task
            </button>
          )}
        </div>

        <input
          required={!readOnly}
          disabled={readOnly}
          className="mt-2 w-full border-none bg-transparent font-display text-xl font-semibold text-graphite outline-none placeholder:text-graphite/30 disabled:opacity-80"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Task title"
        />

        <textarea
          disabled={readOnly}
          className="field-input mt-3 disabled:opacity-70"
          rows={3}
          placeholder="Add a description…"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <div className="mt-4 grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-medium uppercase tracking-wide text-graphite/50">Status</label>
            <select className="field-input mt-1 font-semibold" value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="todo">To do</option>
              <option value="in_progress">In progress</option>
              <option value="done">Done</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-medium uppercase tracking-wide text-graphite/50">Priority</label>
            <select disabled={readOnly} className="field-input mt-1 disabled:opacity-70" value={priority} onChange={(e) => setPriority(e.target.value)}>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-medium uppercase tracking-wide text-graphite/50">Assignee</label>
            <select
              disabled={readOnly}
              className="field-input mt-1 disabled:opacity-70"
              value={assignee}
              onChange={(e) => setAssignee(e.target.value)}
            >
              <option value="">Unassigned</option>
              {members.map((m) => (
                <option key={m.user._id} value={m.user._id}>
                  {m.user.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs font-medium uppercase tracking-wide text-graphite/50">Due date</label>
            <input
              type="date"
              disabled={readOnly}
              className="field-input mt-1 disabled:opacity-70"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>
        </div>


        <div className="stub-perforation my-5" />

        {error && <p className="mb-4 text-xs font-medium text-coral">{error}</p>}

        <div className="flex justify-end gap-2">
          <button type="button" className="btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="btn-primary" disabled={saving}>
            {saving ? "Saving…" : task ? "Save changes" : "Create task"}
          </button>
        </div>
      </form>
    </div>
  );
}
