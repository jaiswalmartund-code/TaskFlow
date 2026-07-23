export default function EmptyState({ title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-card border border-dashed border-line bg-paper/60 px-8 py-16 text-center">
      <h3 className="font-display text-xl text-graphite">{title}</h3>
      <p className="mt-2 max-w-sm text-sm text-graphite/60">{description}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
