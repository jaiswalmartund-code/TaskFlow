import { useState } from "react";
import Avatar from "./Avatar.jsx";

export default function MemberPanel({ project, currentUserId, userRole, onInvite, onRemove, inviting }) {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("contributor");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const isOwnerOrManager = userRole === "owner" || userRole === "manager";

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!email.trim()) return;
    try {
      const res = await onInvite(email, role);
      setEmail("");
      setSuccess(res?.message || `Invitation request sent to ${email}`);
    } catch (err) {
      setError(err?.response?.data?.message || "Couldn't send invitation request");
    }
  };

  const getRoleLabel = (memberRole, isOwner) => {
    if (isOwner || memberRole === "owner" || memberRole === "manager") return "Product Manager";
    return "Contributor";
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200/80 p-5 shadow-sm">
      <h3 className="text-sm font-bold text-graphite font-sans">Project Members</h3>
      
      <ul className="mt-4 flex flex-col gap-3">
        {project.members.map((m) => {
          const isProjectOwner = (project.owner?._id || project.owner) === m.user?._id;
          const roleLabel = getRoleLabel(m.role, isProjectOwner);

          return (
            <li key={m.user?._id || m.user} className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Avatar user={m.user} size={28} />
                <div>
                  <p className="text-xs font-semibold text-graphite">{m.user?.name || "Member"}</p>
                  <p className="text-[10px] font-mono text-graphite/50">{roleLabel}</p>
                </div>
              </div>

              {isOwnerOrManager && !isProjectOwner && m.user?._id !== currentUserId && (
                <button
                  onClick={() => onRemove(m.user._id)}
                  className="rounded-lg border border-rose-200 bg-rose-50 px-2 py-1 text-[11px] font-semibold text-rose-600 hover:bg-rose-100 transition shrink-0"
                  title="Remove member from project"
                >
                  Remove
                </button>
              )}
            </li>
          );
        })}
      </ul>

      {isOwnerOrManager && (
        <form onSubmit={submit} className="mt-5 border-t border-dashed border-gray-200 pt-4">
          <label className="text-xs font-bold text-graphite/70">
            Invite Member Request
          </label>

          <div className="mt-2 space-y-2">
            <input
              type="email"
              className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-3 py-2 text-xs placeholder:text-graphite/40 focus:outline-none focus:ring-2 focus:ring-[#3F6659]/30 focus:border-[#3F6659]"
              placeholder="teammate@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <div className="flex gap-2">
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-3 py-2 text-xs font-medium text-graphite focus:outline-none focus:ring-2 focus:ring-[#3F6659]/30"
              >
                <option value="contributor">Contributor</option>
                <option value="manager">Product Manager</option>
              </select>

              <button
                type="submit"
                className="rounded-xl bg-[#1B1F23] px-4 py-2 text-xs font-medium text-white hover:bg-black transition disabled:opacity-50 shrink-0"
                disabled={inviting}
              >
                Send
              </button>
            </div>
          </div>


          {error && <p className="mt-2 text-xs text-coral">{error}</p>}
          {success && <p className="mt-2 text-xs text-emerald-600 font-medium">{success}</p>}

          <p className="mt-2 text-[11px] text-graphite/40 font-mono leading-tight">
            An invitation request will be sent to their TaskFlow profile to accept or decline.
          </p>
        </form>
      )}
    </div>
  );
}
