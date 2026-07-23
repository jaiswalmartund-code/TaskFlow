export default function Avatar({ user, size = 28 }) {
  if (!user) {
    return (
      <div
        className="flex items-center justify-center rounded-full border border-dashed border-line text-graphite/30"
        style={{ width: size, height: size, fontSize: size * 0.4 }}
        title="Unassigned"
      >
        ?
      </div>
    );
  }

  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div
      className="flex items-center justify-center rounded-full font-mono font-medium text-paper"
      style={{
        width: size,
        height: size,
        fontSize: size * 0.38,
        backgroundColor: user.avatarColor || "#3F6659",
      }}
      title={user.name}
    >
      {initials}
    </div>
  );
}
