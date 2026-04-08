export default function TagList({ tags, active, onSelect }: { tags: string[]; active: string | null; onSelect: (t: string | null) => void }) {
  return (
    <div className="flex gap-2 flex-wrap">
      <button onClick={() => onSelect(null)} className={`text-sm px-2 py-1 rounded ${active === null ? 'bg-blue-100 dark:bg-blue-900' : 'bg-gray-100 dark:bg-zinc-800'}`}>
        All
      </button>
      {tags.map((t) => (
        <button key={t} onClick={() => onSelect(t)} className={`text-sm px-2 py-1 rounded ${active === t ? 'bg-blue-100 dark:bg-blue-900' : 'bg-gray-100 dark:bg-zinc-800'}`}>
          #{t}
        </button>
      ))}
    </div>
  );
}
