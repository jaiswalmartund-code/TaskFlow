import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as personalNotesApi from "../api/personalNotes";

const PASTEL_COLORS = [
  { name: "Yellow", hex: "#FEF9C3", border: "border-yellow-300/80" },
  { name: "Green", hex: "#DCFCE7", border: "border-emerald-300/80" },
  { name: "Blue", hex: "#E0F2FE", border: "border-sky-300/80" },
  { name: "Pink", hex: "#FCE7F3", border: "border-pink-300/80" },
  { name: "Amber", hex: "#FFEDD5", border: "border-amber-300/80" },
];

export default function PersonalStickyNotes() {
  const queryClient = useQueryClient();
  const [text, setText] = useState("");
  const [color, setColor] = useState("#FEF9C3");
  const [addingNote, setAddingNote] = useState(false);

  const { data: notes = [], isLoading } = useQuery({
    queryKey: ["personal-notes"],
    queryFn: personalNotesApi.fetchPersonalNotes,
  });

  const createMutation = useMutation({
    mutationFn: ({ text, color }) => personalNotesApi.createPersonalNote(text, color),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["personal-notes"] });
      setText("");
      setAddingNote(false);
    },
  });

  const toggleMutation = useMutation({
    mutationFn: personalNotesApi.togglePersonalNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["personal-notes"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: personalNotesApi.deletePersonalNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["personal-notes"] });
    },
  });

  const handleAdd = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    createMutation.mutate({ text: text.trim(), color });
  };

  return (
    <div className="mt-12 pt-8 border-t border-gray-200/80">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xl">📌</span>
            <h2 className="font-display text-2xl font-bold text-graphite">Personal Sticky Notes To-Do</h2>
          </div>
          <p className="text-xs text-graphite/60 mt-1">
            Your personal quick to-do list & scratchpad sticky notes.
          </p>
        </div>

        <button
          onClick={() => setAddingNote(!addingNote)}
          className="self-start sm:self-auto rounded-xl bg-[#1B1F23] px-4 py-2 text-xs font-semibold text-white hover:bg-black transition shadow-sm flex items-center gap-1.5"
        >
          <span>{addingNote ? "Close Form" : "+ Pin Sticky Note"}</span>
        </button>
      </div>

      {/* Form to Pin a Personal Sticky Note */}
      {addingNote && (
        <form
          onSubmit={handleAdd}
          className="mb-8 rounded-2xl bg-white p-5 border border-gray-200/80 shadow-md max-w-xl transition-all"
        >
          <h4 className="text-xs font-bold text-graphite uppercase tracking-wider mb-3">
            Add New Personal Sticky Note
          </h4>

          <div className="space-y-3">
            <div>
              <label className="text-xs font-medium text-graphite/60 block mb-1">Sticky Note Text</label>
              <textarea
                rows={3}
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Write your personal task, note, or quick reminder here…"
                className="w-full rounded-xl border border-gray-200 bg-gray-50/50 p-3 text-xs text-graphite placeholder:text-graphite/40 focus:outline-none focus:ring-2 focus:ring-[#3F6659]/30"
              />
            </div>

            <div className="flex items-center justify-between pt-1">
              <div>
                <span className="text-xs font-medium text-graphite/60 block mb-1">Color</span>
                <div className="flex gap-2">
                  {PASTEL_COLORS.map((c) => (
                    <button
                      type="button"
                      key={c.hex}
                      onClick={() => setColor(c.hex)}
                      className={`h-6 w-6 rounded-full border-2 transition ${c.border} ${
                        color === c.hex ? "scale-110 ring-2 ring-graphite" : "hover:scale-105"
                      }`}
                      style={{ backgroundColor: c.hex }}
                    />
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="rounded-xl bg-[#3F6659] px-5 py-2 text-xs font-semibold text-white hover:bg-[#2C4A40] transition shadow-sm disabled:opacity-50"
                disabled={createMutation.isPending || !text.trim()}
              >
                {createMutation.isPending ? "Pinning…" : "Pin Note"}
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Grid of Personal Sticky Notes */}
      {isLoading ? (
        <p className="font-mono text-xs text-graphite/40">Loading personal notes…</p>
      ) : notes.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-gray-200 bg-white/40 p-8 text-center">
          <p className="text-sm font-medium text-graphite/60">No personal sticky notes yet</p>
          <p className="text-xs text-graphite/40 mt-1 font-mono">
            Click "+ Pin Sticky Note" to create your first personal sticky note.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {notes.map((note) => (
            <div
              key={note._id}
              className={`group relative flex flex-col justify-between rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-200 border border-black/5 ${
                note.completed ? "opacity-60 grayscale-[20%]" : "rotate-[-0.5deg] hover:rotate-0 hover:-translate-y-1"
              }`}
              style={{ backgroundColor: note.color || "#FEF9C3" }}
            >
              {/* Tape accent */}
              <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 h-4 w-12 bg-white/40 border border-black/5 rounded-sm backdrop-blur-xs rotate-[-2deg]" />

              <div>
                <div className="flex items-center justify-between gap-2 border-b border-black/5 pb-2 mb-3">
                  <span className="text-[10px] font-bold font-mono uppercase tracking-wider text-graphite/70 truncate">
                    📌 Personal To-Do
                  </span>
                  <button
                    onClick={() => deleteMutation.mutate(note._id)}
                    className="text-graphite/30 hover:text-coral text-xs transition"
                    title="Delete note"
                  >
                    ✕
                  </button>
                </div>

                <p
                  className={`text-xs font-sans leading-relaxed whitespace-pre-wrap ${
                    note.completed ? "line-through text-graphite/50" : "text-graphite/90"
                  }`}
                >
                  "{note.text}"
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-black/5 flex items-center justify-between text-[10px] font-mono text-graphite/50">
                <label className="flex items-center gap-1.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={note.completed}
                    onChange={() => toggleMutation.mutate(note._id)}
                    className="rounded text-[#3F6659] focus:ring-0"
                  />
                  <span className="font-sans font-semibold">{note.completed ? "Done" : "Mark done"}</span>
                </label>

                <span>
                  {new Date(note.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
