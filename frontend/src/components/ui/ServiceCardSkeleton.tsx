export default function ServiceCardSkeleton() {
  return (
    <div className="animate-pulse bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-5">
      <div className="h-4 bg-gray-300 rounded w-1/2 mb-4"></div>
      <div className="h-3 bg-gray-300 rounded w-1/3 mb-2"></div>
      <div className="h-3 bg-gray-300 rounded w-1/4"></div>
      <div className="mt-5 h-8 bg-gray-300 rounded"></div>
    </div>
  );
}