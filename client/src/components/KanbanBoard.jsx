import { DndContext, useDroppable, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import TaskCard from "./TaskCard.jsx";

const COLUMNS = [
  { key: "todo", label: "To do" },
  { key: "in_progress", label: "In progress" },
  { key: "done", label: "Done" },
];

function Column({ column, tasks, onOpen }) {
  const { setNodeRef, isOver } = useDroppable({ id: column.key });

  return (
    <div
      ref={setNodeRef}
      className={`flex min-h-[60vh] w-full flex-col rounded-card border border-line/70 bg-bone/60 p-3 transition ${
        isOver ? "ring-2 ring-moss/40" : ""
      }`}
    >
      <div className="mb-3 flex items-center justify-between px-1">
        <h3 className="font-display text-sm font-semibold text-graphite">{column.label}</h3>
        <span className="rounded-full bg-paper px-2 py-0.5 font-mono text-[11px] text-graphite/50 border border-line">
          {tasks.length}
        </span>
      </div>
      <div className="flex flex-col gap-3">
        {tasks.map((t) => (
          <TaskCard key={t._id} task={t} onOpen={onOpen} />
        ))}
        {tasks.length === 0 && (
          <p className="rounded-md border border-dashed border-line px-3 py-6 text-center font-mono text-[11px] text-graphite/30">
            Drop tasks here
          </p>
        )}
      </div>
    </div>
  );
}

export default function KanbanBoard({ tasks, onOpen, onStatusChange }) {
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over) return;
    const task = tasks.find((t) => t._id === active.id);
    if (task && task.status !== over.id) {
      onStatusChange(task._id, over.id);
    }
  };

  return (
    <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {COLUMNS.map((col) => (
          <Column
            key={col.key}
            column={col}
            tasks={tasks.filter((t) => t.status === col.key)}
            onOpen={onOpen}
          />
        ))}
      </div>
    </DndContext>
  );
}
