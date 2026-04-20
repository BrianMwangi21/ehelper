export default function Navbar() {
  return (
    <nav className="flex items-center justify-between px-6 py-3 border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="flex items-center gap-2.5">
        <div className="w-7 h-7 rounded-md bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center">
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 2L2 7l10 5 10-5-10-5z" />
            <path d="M2 17l10 5 10-5" />
            <path d="M2 12l10 5 10-5" />
          </svg>
        </div>
        <span className="text-base font-semibold tracking-tight text-zinc-100">
          ehelper
        </span>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-xs text-zinc-500 font-medium">browser automation</span>
      </div>
    </nav>
  );
}