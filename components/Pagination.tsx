export default function Pagination({ current, total, onChange }: { current: number; total: number; onChange: (p: number) => void }) {
  const prev = () => onChange(Math.max(1, current - 1));
  const next = () => onChange(Math.min(total, current + 1));
  return (
    <div className="flex items-center gap-3">
      <button onClick={prev} disabled={current === 1} className="px-3 py-1 rounded bg-gray-100 dark:bg-zinc-800">
        Prev
      </button>
      <span className="text-sm">{current} / {total}</span>
      <button onClick={next} disabled={current === total} className="px-3 py-1 rounded bg-gray-100 dark:bg-zinc-800">
        Next
      </button>
    </div>
  );
}
