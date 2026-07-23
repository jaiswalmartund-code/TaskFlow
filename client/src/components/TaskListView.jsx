import Avatar from "./Avatar.jsx";

const STATUS_LABEL = { todo: "To do", in_progress: "In progress", done: "Done" };
const PRIORITY_DOT = { high: "bg-coral", medium: "bg-amber", low: "bg-slate" };

export default function TaskListView({ tasks, onOpen }) {
  if (tasks.length === 0) {
    return (
      <p className="rounded-card border border-dashed border-line px-3 py-16 text-center font-mono text-xs text-graphite/30">
        No tasks yet
      </p>
    );
  }

  return (
    <div className="overflow-hidden rounded-card border border-line bg-paper shadow-card">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-line bg-bone/60 font-mono text-[11px] uppercase tracking-wide text-graphite/50">
            <th className="px-4 py-3 font-medium">Task</th>
            <th className="px-4 py-3 font-medium">Status</th>
            <th className="px-4 py-3 font-medium">Priority</th>
            <th className="px-4 py-3 font-medium">Due</th>
            <th className="px-4 py-3 font-medium">Assignee</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((t) => {
            const overdue = t.dueDate && t.status !== "done" && new Date(t.dueDate) < new Date();
            return (
              <tr
                key={t._id}
                onClick={() => onOpen(t)}
                className="cursor-pointer border-b border-line/60 last:border-0 hover:bg-bone/40"
              >
                <td className="px-4 py-3 font-medium text-graphite">{t.title}</td>
                <td className="px-4 py-3 text-graphite/70">{STATUS_LABEL[t.status]}</td>
                <td className="px-4 py-3">
                  <span className="inline-flex items-center gap-1.5 text-xs text-graphite/70">
                    <span className={`h-1.5 w-1.5 rounded-full ${PRIORITY_DOT[t.priority]}`} />
                    {t.priority}
                  </span>
                </td>
                <td className={`px-4 py-3 font-mono text-xs ${overdue ? "text-coral font-medium" : "text-graphite/50"}`}>
                  {t.dueDate ? new Date(t.dueDate).toLocaleDateString() : "—"}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Avatar user={t.assignee} size={20} />
                    <span className="text-xs text-graphite/60">{t.assignee?.name || "Unassigned"}</span>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
