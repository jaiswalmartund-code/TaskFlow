import { Link } from "react-router-dom";
import Avatar from "./Avatar.jsx";

export default function ProjectCard({ project, onEdit, onDelete }) {
  // Determine progress and color coding
  const progressPercent = project.progress !== undefined ? project.progress : 0;
  let progressColorClass = "bg-[#D96C5F]"; // Red for < 34%
  if (progressPercent >= 67) {
    progressColorClass = "bg-[#3F6659]"; // Green for >= 67%
  } else if (progressPercent >= 34) {
    progressColorClass = "bg-[#E2A33D]"; // Yellow/Amber for 34% - 66%
  }

  return (
    <div className="group relative flex flex-col justify-between rounded-2xl border border-gray-200/70 bg-white p-6 shadow-sm hover:shadow-md transition-all duration-200">
      <div>
        {/* Top Color Dot */}
        <div className="flex items-center justify-between">
          <span
            className="h-2.5 w-2.5 rounded-full"
            style={{ backgroundColor: project.color || "#3F6659" }}
          />
        </div>

        {/* Title & Description */}
        <Link to={`/projects/${project._id}`} className="block mt-4">
          <h3 className="font-display text-xl font-bold text-graphite group-hover:text-moss transition-colors">
            {project.name}
          </h3>
          <p className="mt-2 line-clamp-2 text-xs text-graphite/60 leading-relaxed min-h-[34px]">
            {project.description || "No description provided for this project."}
          </p>
        </Link>
      </div>

      <div>
        {/* Progress Bar Section */}
        <div className="mt-6">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="font-mono text-[11px] text-graphite/50">Progress</span>
            <span className="font-bold text-graphite">{progressPercent}%</span>
          </div>
          <div className="h-1.5 w-full rounded-full bg-gray-100 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${progressColorClass}`}
              style={{ width: `${Math.max(5, progressPercent)}%` }}
            />
          </div>
        </div>


        {/* Footer with Member Avatars and Options */}
        <div className="mt-6 flex items-center justify-between pt-2">
          <div className="flex items-center -space-x-1.5">
            {project.members && project.members.length > 0 ? (
              project.members.slice(0, 4).map((m, idx) => (
                <div key={m.user?._id || idx} className="ring-2 ring-white rounded-full">
                  <Avatar user={m.user} size={26} />
                </div>
              ))
            ) : (
              <div className="ring-2 ring-white rounded-full">
                <Avatar user={project.owner} size={26} />
              </div>
            )}
          </div>

          <Link
            to={`/projects/${project._id}`}
            className="text-graphite/40 hover:text-graphite p-1 rounded-md hover:bg-gray-100 transition"
            title="Open project"
          >
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}
