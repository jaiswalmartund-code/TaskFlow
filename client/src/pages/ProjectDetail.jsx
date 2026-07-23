import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Navbar from "../components/Navbar.jsx";
import KanbanBoard from "../components/KanbanBoard.jsx";
import TaskListView from "../components/TaskListView.jsx";
import TaskModal from "../components/TaskModal.jsx";
import MemberPanel from "../components/MemberPanel.jsx";
import ProjectFormModal from "../components/ProjectFormModal.jsx";
import TaskStickyNotes from "../components/TaskStickyNotes.jsx";
import * as projectsApi from "../api/projects";

import * as tasksApi from "../api/tasks";
import { useAuth } from "../context/AuthContext.jsx";

export default function ProjectDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [view, setView] = useState("board");
  const [activeTask, setActiveTask] = useState(null); // task being edited
  const [creatingTask, setCreatingTask] = useState(false);
  const [editingProject, setEditingProject] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["project", id],
    queryFn: () => projectsApi.fetchProject(id),
  });

  const { data: tasks = [] } = useQuery({
    queryKey: ["tasks", id],
    queryFn: () => tasksApi.fetchTasks(id),
    enabled: !!data,
  });

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["tasks", id] });
    queryClient.invalidateQueries({ queryKey: ["project", id] });
    queryClient.invalidateQueries({ queryKey: ["projects"] });
  };

  const createTaskMutation = useMutation({
    mutationFn: (payload) => tasksApi.createTask(id, payload),
    onSuccess: () => {
      invalidate();
      setCreatingTask(false);
    },
  });

  const updateTaskMutation = useMutation({
    mutationFn: ({ taskId, payload }) => tasksApi.updateTask(taskId, payload),
    onSuccess: () => {
      invalidate();
      setActiveTask(null);
    },
  });

  const statusOnlyMutation = useMutation({
    mutationFn: ({ taskId, status }) => tasksApi.updateTask(taskId, { status }),
    onSuccess: invalidate,
  });

  const deleteTaskMutation = useMutation({
    mutationFn: tasksApi.deleteTask,
    onSuccess: () => {
      invalidate();
      setActiveTask(null);
    },
  });

  const updateProjectMutation = useMutation({
    mutationFn: (payload) => projectsApi.updateProject(id, payload),
    onSuccess: () => {
      invalidate();
      setEditingProject(false);
    },
  });

  const deleteProjectMutation = useMutation({
    mutationFn: () => projectsApi.deleteProject(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.removeQueries({ queryKey: ["project", id] });
      queryClient.removeQueries({ queryKey: ["tasks", id] });
      setConfirmDelete(false);
      navigate("/dashboard");
    },
  });

  const inviteMutation = useMutation({
    mutationFn: ({ email, role }) => projectsApi.addMember(id, email, role),
    onSuccess: invalidate,
  });

  const removeMemberMutation = useMutation({
    mutationFn: (userId) => projectsApi.removeMember(id, userId),
    onSuccess: invalidate,
  });

  if (isLoading || !data) {
    return (
      <div className="min-h-screen bg-bone bg-graph-subtle">
        <Navbar />
        <p className="mx-auto max-w-6xl px-6 py-10 font-mono text-sm text-graphite/40">
          Loading project…
        </p>
      </div>
    );
  }

  const { project, taskCounts, userRole = "contributor" } = data;
  const isOwner = project.owner?._id === user?._id || userRole === "owner";
  const isManager = isOwner || userRole === "manager";
  const isContributor = userRole === "contributor";

  const doneCount = taskCounts.find((c) => c._id === "done")?.count || 0;
  const totalCount = taskCounts.reduce((sum, c) => sum + c.count, 0);
  const overdueCount = tasks.filter(
    (t) => t.dueDate && t.status !== "done" && new Date(t.dueDate) < new Date()
  ).length;

  return (
    <div className="min-h-screen bg-bone bg-graph-subtle">
      <Navbar />
      <main className="mx-auto max-w-6xl px-6 py-8 sm:py-10">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <button
              onClick={() => navigate("/dashboard")}
              className="text-xs font-semibold text-graphite/50 mb-2 hover:text-graphite flex items-center gap-1"
            >
              ← All projects
            </button>
            <div className="flex items-center gap-2.5">
              <span className="h-3 w-3 rounded-full" style={{ backgroundColor: project.color }} />
              <h1 className="font-display text-3xl sm:text-4xl font-bold text-graphite">{project.name}</h1>
              <span className="ml-2 rounded-full bg-gray-200/80 px-2.5 py-0.5 font-mono text-[11px] font-semibold uppercase text-graphite/70">
                {isManager ? "Product Manager" : "Contributor"}
              </span>
            </div>
            <p className="mt-1 max-w-xl text-sm text-graphite/60">{project.description}</p>
          </div>

          {isManager && (
            <div className="flex gap-2">
              <button className="btn-secondary" onClick={() => setEditingProject(true)}>
                Edit project
              </button>
              <button
                className="btn-secondary text-coral hover:bg-coral-light disabled:opacity-50"
                onClick={() => setConfirmDelete(true)}
              >
                Delete
              </button>
            </div>
          )}
        </div>

        {/* Delete Confirmation Modal */}
        {confirmDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
            <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl border border-gray-100">
              <h3 className="font-display text-xl font-bold text-graphite">Delete Project?</h3>
              <p className="mt-2 text-xs text-graphite/70 leading-relaxed">
                Are you sure you want to delete <span className="font-bold text-graphite">{project.name}</span> and all of its tasks? This action cannot be undone.
              </p>
              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-xs font-semibold text-graphite hover:bg-gray-50 transition"
                  onClick={() => setConfirmDelete(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="rounded-xl bg-rose-600 px-4 py-2 text-xs font-semibold text-white hover:bg-rose-700 transition shadow-sm disabled:opacity-50"
                  disabled={deleteProjectMutation.isPending}
                  onClick={() => deleteProjectMutation.mutate()}
                >
                  {deleteProjectMutation.isPending ? "Deleting…" : "Yes, Delete Project"}
                </button>
              </div>
            </div>
          </div>
        )}



        {/* Stats strip */}
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <StatCard label="Total tasks" value={totalCount} />
          <StatCard label="Completed" value={`${doneCount}/${totalCount || 0}`} />
          <StatCard label="Overdue" value={overdueCount} accent={overdueCount > 0 ? "text-coral" : ""} />
          <StatCard label="Members" value={project.members.length} />
        </div>

        <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_280px]">
          <div>
            <div className="mb-4 flex items-center justify-between">
              <div className="inline-flex rounded-xl border border-gray-200 bg-white p-1 shadow-sm">
                {["board", "list"].map((v) => (
                  <button
                    key={v}
                    onClick={() => setView(v)}
                    className={`rounded-lg px-3.5 py-1 text-xs font-semibold capitalize transition ${
                      view === v ? "bg-[#3F6659] text-white" : "text-graphite/60 hover:text-graphite"
                    }`}
                  >
                    {v}
                  </button>
                ))}
              </div>

              {isManager && (
                <button
                  className="rounded-xl bg-[#1B1F23] px-4 py-2 text-xs font-medium text-white hover:bg-black transition shadow-sm"
                  onClick={() => setCreatingTask(true)}
                >
                  + New task
                </button>
              )}
            </div>

            {view === "board" ? (
              <KanbanBoard
                tasks={tasks}
                onOpen={setActiveTask}
                onStatusChange={(taskId, status) => statusOnlyMutation.mutate({ taskId, status })}
              />
            ) : (
              <TaskListView tasks={tasks} onOpen={setActiveTask} />
            )}
          </div>

          <MemberPanel
            project={project}
            currentUserId={user._id}
            userRole={userRole}
            onInvite={(email, role) => inviteMutation.mutateAsync({ email, role })}
            onRemove={(userId) => removeMemberMutation.mutate(userId)}
            inviting={inviteMutation.isPending}
          />
        </div>

        {/* Task Remarks & Sticky Notes Section */}
        <TaskStickyNotes
          tasks={tasks}
          projectId={id}
          currentUserId={user._id}
          userRole={userRole}
        />
      </main>


      {(creatingTask || activeTask) && (
        <TaskModal
          task={activeTask}
          members={project.members}
          readOnly={isContributor}
          saving={createTaskMutation.isPending || updateTaskMutation.isPending}
          onClose={() => {
            setActiveTask(null);
            setCreatingTask(false);
          }}
          onSave={(payload) => {
            if (activeTask) {
              updateTaskMutation.mutate({ taskId: activeTask._id, payload });
            } else {
              createTaskMutation.mutate(payload);
            }
          }}
          onDelete={(taskId) => deleteTaskMutation.mutate(taskId)}
        />
      )}

      {editingProject && (
        <ProjectFormModal
          initial={project}
          onClose={() => setEditingProject(false)}
          onSubmit={(payload) => updateProjectMutation.mutate(payload)}
          submitting={updateProjectMutation.isPending}
        />
      )}
    </div>
  );
}

function StatCard({ label, value, accent = "" }) {
  return (
    <div className="rounded-2xl border border-gray-200/80 bg-white px-4 py-3 shadow-sm">
      <p className="tag-eyebrow">{label}</p>
      <p className={`mt-1 font-display text-2xl font-semibold text-graphite ${accent}`}>{value}</p>
    </div>
  );
}
