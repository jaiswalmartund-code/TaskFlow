import { useDraggable } from "@dnd-kit/core";
import Avatar from "./Avatar.jsx";

const PRIORITY_STYLES = {
  high: { label: "High", dot: "bg-coral", text: "text-coral" },
  medium: { label: "Med", dot: "bg-amber", text: "text-amber" },
  low: { label: "Low", dot: "bg-slate", text: "text-slate" },
};

function isOverdue(task) {
  return task.dueDate && task.status !== "done" && new Date(task.dueDate) < new Date();
}

export default function TaskCard({ task, onOpen }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: task._id,
  });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        zIndex: 50,
      }
    : undefined;

  const priority = PRIORITY_STYLES[task.priority];
  const overdue = isOverdue(task);

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      onClick={() => onOpen(task)}
      className={`stub-card cursor-pointer px-4 pb-3 pt-4 transition ${
        isDragging ? "opacity-50" : "hover:shadow-lifted"
      }`}
    >
      <div className="flex items-center justify-between">
        <span className={`flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-wide ${priority.text}`}>
          <span className={`h-1.5 w-1.5 rounded-full ${priority.dot}`} />
          {priority.label}
        </span>
        {task.dueDate && (
          <span className={`font-mono text-[11px] ${overdue ? "text-coral font-medium" : "text-graphite/40"}`}>
            {overdue ? "Overdue " : ""}
            {new Date(task.dueDate).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
          </span>
        )}
      </div>

      <p className="mt-2 text-sm font-medium leading-snug text-graphite">{task.title}</p>

      <div className="stub-perforation my-3" />

      <div className="flex items-center justify-between">
        <span className="font-mono text-[10px] text-graphite/35">
          #{task._id.slice(-5)}
        </span>
        <Avatar user={task.assignee} size={22} />
      </div>
    </div>
  );
}
