import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import * as tasksApi from "../api/tasks";

export default function UpcomingDeadlines() {
  const [showAllModal, setShowAllModal] = useState(false);

  const { data: realTasks, isLoading } = useQuery({
    queryKey: ["upcoming-deadlines"],
    queryFn: tasksApi.fetchUpcomingDeadlines,
  });

  const displayTasks = realTasks || [];
  const topTasks = displayTasks.slice(0, 3);

  return (
    <div className="mt-12">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-bold text-graphite font-sans">Upcoming Deadlines</h2>
        {displayTasks.length > 0 && (
          <button
            onClick={() => setShowAllModal(true)}
            className="text-xs font-semibold text-[#3F6659] hover:underline flex items-center gap-1.5 transition"
          >
            <span>View all deadlines ({displayTasks.length})</span>
            <span className="text-sm">→</span>
          </button>
        )}
      </div>

      {/* Main Container / Grid */}
      {isLoading ? (
        <div className="bg-white rounded-2xl border border-gray-200/70 p-6 shadow-sm">
          <p className="font-mono text-xs text-graphite/40">Loading deadlines…</p>
        </div>
      ) : displayTasks.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200/70 p-8 shadow-sm text-center">
          <p className="text-sm font-medium text-graphite/60">No upcoming deadlines</p>
          <p className="text-xs text-graphite/40 mt-1 font-mono">
            Tasks created with future due dates will appear here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {topTasks.map((task) => (
            <DeadlineCard key={task._id} task={task} />
          ))}
        </div>
      )}

      {/* All Deadlines Modal */}
      {showAllModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
          <div className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-xl border border-gray-100 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <div>
                <h3 className="font-display text-xl font-bold text-graphite">All Upcoming Deadlines</h3>
                <p className="text-xs text-graphite/50 mt-0.5 font-mono">
                  {displayTasks.length} pending task deadlines
                </p>
              </div>
              <button
                onClick={() => setShowAllModal(false)}
                className="rounded-lg p-1 text-graphite/40 hover:bg-gray-100 hover:text-graphite transition"
              >
                ✕
              </button>
            </div>

            <div className="mt-4 overflow-y-auto space-y-3 pr-1">
              {displayTasks.map((task) => (
                <DeadlineCard key={task._id} task={task} isModal />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function DeadlineCard({ task, isModal = false }) {
  const projectId = task.project?._id || task.project;
  const dateObj = new Date(task.dueDate);
  const month = dateObj.toLocaleString("en-US", { month: "short" }).toUpperCase();
  const day = dateObj.getDate();

  // Calculate days left
  const diffTime = dateObj.getTime() - Date.now();
  const diffDays = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

  const priorityLower = (task.priority || "medium").toLowerCase();
  let priorityBadgeClass = "bg-amber-50 text-amber-700 border-amber-200/60";
  if (priorityLower === "high") {
    priorityBadgeClass = "bg-rose-50 text-rose-600 border-rose-200/60";
  } else if (priorityLower === "low") {
    priorityBadgeClass = "bg-emerald-50 text-emerald-700 border-emerald-200/60";
  }

  return (
    <Link
      to={`/projects/${projectId}`}
      className={`bg-white rounded-2xl border border-gray-200/80 p-4 shadow-sm hover:shadow-md hover:border-gray-300 transition-all flex items-center justify-between gap-3 group ${
        isModal ? "w-full" : ""
      }`}
    >
      <div className="flex items-center gap-3.5 min-w-0">
        {/* Date Badge */}
        <div className="bg-gray-100/80 rounded-xl px-3 py-2 flex flex-col items-center justify-center min-w-[50px] shrink-0 border border-gray-200/40">
          <span className="font-mono text-[10px] font-bold text-graphite/50 uppercase tracking-wider leading-none">
            {month}
          </span>
          <span className="font-display text-base font-bold text-graphite leading-none mt-1">
            {day}
          </span>
        </div>

        {/* Task & Project Information */}
        <div className="min-w-0">
          <h4
            className="text-xs sm:text-sm font-bold text-graphite font-sans leading-snug truncate group-hover:text-moss transition-colors"
            title={task.title}
          >
            {task.title}
          </h4>
          <div className="flex items-center gap-1.5 mt-1">
            <span
              className="h-2 w-2 rounded-full shrink-0"
              style={{ backgroundColor: task.project?.color || "#3F6659" }}
            />
            <span className="text-[11px] text-graphite/60 font-medium truncate">
              {task.project?.name || "Project"}
            </span>
          </div>
        </div>
      </div>

      {/* Priority & Time Left Stack */}
      <div className="text-right flex flex-col items-end shrink-0 pl-1">
        <span
          className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold border capitalize tracking-wide ${priorityBadgeClass}`}
        >
          {task.priority || "Medium"}
        </span>
        <span className="text-[11px] text-graphite/50 font-mono mt-1 whitespace-nowrap">
          {diffDays === 0 ? "Due today" : `${diffDays} ${diffDays === 1 ? "day" : "days"} left`}
        </span>
      </div>
    </Link>
  );
}

