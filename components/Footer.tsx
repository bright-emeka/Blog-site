export default function Footer() {
  return (
    <footer className="border-t border-gray-200 dark:border-zinc-700 mt-8">
      <div className="container py-6 text-sm text-gray-600 dark:text-gray-300 flex justify-between">
        <div>© {new Date().getFullYear()} Scrolls</div>
      </div>
    </footer>
  );
}
