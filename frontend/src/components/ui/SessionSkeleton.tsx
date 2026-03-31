export default function SessionSkeleton() {
  return (
    <div className="p-4 bg-white rounded-2xl border animate-pulse">
      <div className="h-4 w-32 bg-gray-200 rounded mb-2"></div>
      <div className="h-3 w-24 bg-gray-200 rounded mb-1"></div>
      <div className="h-3 w-20 bg-gray-200 rounded"></div>
    </div>
  );
}