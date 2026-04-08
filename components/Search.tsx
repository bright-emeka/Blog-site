export default function Search({ value, onChange, placeholder = 'Search' }: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full sm:w-64 px-3 py-2 border rounded border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-sm"
    />
  );
}
