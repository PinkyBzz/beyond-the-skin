export default function Loading() {
  return (
    <div
      className="min-h-screen flex items-center justify-center"
      aria-label="Loading"
      role="status"
    >
      <div className="flex flex-col items-center gap-4">
        <div className="relative h-12 w-12">
          <div className="absolute inset-0 rounded-full border-4 border-[#FFB6D6]/30" />
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-[#FFB6D6] animate-spin" />
        </div>
        <p className="text-sm text-[#3A3A3A]/50 font-medium animate-pulse">Loading…</p>
      </div>
    </div>
  )
}
