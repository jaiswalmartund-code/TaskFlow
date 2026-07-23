import { useState, useRef, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../context/AuthContext.jsx";
import Avatar from "./Avatar.jsx";
import * as invitationsApi from "../api/invitations";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [inviteOpen, setInviteOpen] = useState(false);

  const dropdownRef = useRef(null);
  const inviteRef = useRef(null);

  const { data: invitations = [] } = useQuery({
    queryKey: ["my-invitations"],
    queryFn: invitationsApi.fetchMyInvitations,
    enabled: !!user,
  });

  const respondMutation = useMutation({
    mutationFn: ({ id, action }) => invitationsApi.respondToInvitation(id, action),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-invitations"] });
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
      if (inviteRef.current && !inviteRef.current.contains(event.target)) {
        setInviteOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-bone/80 backdrop-blur-md border-b border-gray-200/60 transition-all">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
        {/* Left: Brand Badge & Heading */}
        <Link to="/dashboard" className="flex items-center gap-2.5 group">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#1B1F23] font-mono text-xs font-bold text-white shadow-sm transition-transform group-hover:scale-105">
            TF
          </div>
          <span className="font-display text-lg font-bold tracking-tight text-graphite">
            TaskFlow
          </span>
        </Link>

        {/* Center: Navigation Pill Bar (Home & Code only, No Emoji) */}
        {user && (
          <nav className="flex items-center gap-1 rounded-full bg-gray-200/60 p-1 border border-gray-300/40">
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                `rounded-full px-5 py-1.5 text-xs font-bold transition-all ${
                  isActive
                    ? "bg-[#1B1F23] text-white shadow-sm"
                    : "text-graphite/70 hover:text-graphite hover:bg-white/50"
                }`
              }
            >
              Home
            </NavLink>

            <NavLink
              to="/github"
              className={({ isActive }) =>
                `rounded-full px-5 py-1.5 text-xs font-bold transition-all ${
                  isActive
                    ? "bg-[#1B1F23] text-white shadow-sm"
                    : "text-graphite/70 hover:text-graphite hover:bg-white/50"
                }`
              }
            >
              Code
            </NavLink>
          </nav>
        )}

        {/* Right Widgets: Invitations & User Profile */}
        {user && (
          <div className="flex items-center gap-3">
            {/* Invitation Requests Notification Dropdown */}
            <div className="relative" ref={inviteRef}>
              <button
                onClick={() => setInviteOpen(!inviteOpen)}
                className="relative flex h-8 w-8 items-center justify-center rounded-full bg-white/80 backdrop-blur-sm border border-gray-200/60 shadow-sm hover:bg-white transition text-graphite/70 hover:text-graphite"
                title="Project Invitations"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                  />
                </svg>
                {invitations.length > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 font-mono text-[10px] font-bold text-white ring-2 ring-white">
                    {invitations.length}
                  </span>
                )}
              </button>

              {inviteOpen && (
                <div className="absolute right-0 mt-3 w-80 rounded-2xl bg-white p-4 shadow-xl border border-gray-100 font-sans z-50">
                  <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                    <h4 className="text-xs font-bold text-graphite uppercase tracking-wider">
                      Project Invitations ({invitations.length})
                    </h4>
                  </div>

                  <div className="mt-3 max-h-64 overflow-y-auto space-y-3">
                    {invitations.length === 0 ? (
                      <p className="py-4 text-center text-xs text-graphite/50 font-mono">
                        No pending invitations
                      </p>
                    ) : (
                      invitations.map((inv) => (
                        <div
                          key={inv._id}
                          className="rounded-xl border border-gray-100 bg-gray-50/50 p-3 flex flex-col gap-2"
                        >
                          <div>
                            <p className="text-xs font-bold text-graphite">
                              {inv.project?.name || "Project Request"}
                            </p>
                            <p className="text-[11px] text-graphite/60 mt-0.5">
                              <span className="font-semibold">{inv.inviter?.name}</span> invited you as{" "}
                              <span className="font-semibold capitalize text-[#3F6659]">
                                {inv.role === "manager" ? "Product Manager" : "Contributor"}
                              </span>
                            </p>
                          </div>

                          <div className="flex gap-2 justify-end mt-1">
                            <button
                              onClick={() => respondMutation.mutate({ id: inv._id, action: "decline" })}
                              className="px-3 py-1 rounded-lg border border-gray-200 text-xs font-medium text-graphite/70 hover:bg-gray-100 transition"
                              disabled={respondMutation.isPending}
                            >
                              Decline
                            </button>
                            <button
                              onClick={() => respondMutation.mutate({ id: inv._id, action: "accept" })}
                              className="px-3 py-1 rounded-lg bg-[#3F6659] text-xs font-medium text-white hover:bg-[#2C4A40] transition shadow-sm"
                              disabled={respondMutation.isPending}
                            >
                              Accept
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* User Profile Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 rounded-full bg-white/80 px-2.5 py-1 backdrop-blur-sm border border-gray-200/60 shadow-sm hover:bg-white transition"
              >
                <Avatar user={user} size={26} />
                <span className="text-xs font-medium text-graphite/80 hidden sm:inline">
                  {user.email}
                </span>
                <svg
                  className={`h-3.5 w-3.5 text-graphite/50 transition-transform duration-200 ${
                    dropdownOpen ? "rotate-180" : ""
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-3 w-48 rounded-xl bg-white p-2 shadow-lg border border-gray-100 font-sans z-50">
                  <div className="px-3 py-2 border-b border-gray-100">
                    <p className="text-xs font-semibold text-graphite">{user.name}</p>
                    <p className="text-[11px] text-graphite/50 truncate">{user.email}</p>
                  </div>
                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      logout();
                      navigate("/login");
                    }}
                    className="w-full text-left px-3 py-2 text-xs font-medium text-coral hover:bg-rose-50 rounded-lg transition mt-1"
                  >
                    Log out
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
