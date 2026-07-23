import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Navbar from "../components/Navbar.jsx";
import ProjectCard from "../components/ProjectCard.jsx";
import ProjectFormModal from "../components/ProjectFormModal.jsx";
import UpcomingDeadlines from "../components/UpcomingDeadlines.jsx";
import PersonalStickyNotes from "../components/PersonalStickyNotes.jsx";
import * as projectsApi from "../api/projects";
import { useAuth } from "../context/AuthContext.jsx";

export default function Dashboard() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);

  const { data: realProjects = [], isLoading } = useQuery({
    queryKey: ["projects"],
    queryFn: projectsApi.fetchProjects,
  });

  const createMutation = useMutation({
    mutationFn: projectsApi.createProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      setShowForm(false);
    },
  });

  // Calculate dynamic greeting based on current time
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  const firstName = user?.name ? user.name.split(" ")[0] : "User";

  return (
    <div className="min-h-screen bg-bone bg-graph-subtle">
      <Navbar />

      <main className="mx-auto max-w-6xl px-6 py-8 sm:py-10">
        {/* Hero Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6">
          <div>
            <p className="text-sm font-medium text-graphite/60 flex items-center gap-1.5">
              {getGreeting()}, {firstName} <span className="text-base">👏</span>
            </p>
            <h1 className="mt-1 font-display text-4xl sm:text-5xl font-bold text-graphite tracking-tight">
              {firstName}’s projects
            </h1>
            <p className="mt-2 text-sm text-graphite/60 font-normal">
              Here’s what’s happening with your projects today.
            </p>
          </div>

          <button
            onClick={() => setShowForm(true)}
            className="self-start inline-flex items-center gap-2 rounded-xl bg-[#1B1F23] px-5 py-3 text-sm font-medium text-white shadow-sm transition hover:bg-black active:scale-95"
          >
            <span className="text-base leading-none">+</span> New Project
          </button>
        </div>

        {/* Your Projects Section */}
        <section className="mt-10">
          <h2 className="text-base font-bold text-graphite font-sans mb-4">Your Projects</h2>

          {isLoading ? (
            <p className="font-mono text-xs text-graphite/40 py-8">Loading projects…</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {/* Real Project Cards from MongoDB */}
              {realProjects.map((project) => (
                <ProjectCard key={project._id} project={project} />
              ))}

              {/* Create New Project Card */}
              <button
                onClick={() => setShowForm(true)}
                className="group flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 bg-white/40 p-6 text-center transition hover:bg-white hover:border-gray-300 min-h-[220px]"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#E4ECE8] text-[#3F6659] text-2xl font-light transition group-hover:scale-105">
                  +
                </div>
                <h3 className="mt-4 font-display text-lg font-bold text-graphite">
                  Create New Project
                </h3>
                <p className="mt-0.5 text-xs text-graphite/50">Start something new</p>
              </button>
            </div>
          )}
        </section>

        {/* Upcoming Deadlines Section */}
        <UpcomingDeadlines />

        {/* Personal Sticky Notes To-Do Section */}
        <PersonalStickyNotes />
      </main>


      {/* New Project Modal */}
      {showForm && (
        <ProjectFormModal
          onClose={() => setShowForm(false)}
          onSubmit={(data) => createMutation.mutate(data)}
          submitting={createMutation.isPending}
        />
      )}
    </div>
  );
}
