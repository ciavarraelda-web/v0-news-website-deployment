// components/NewsSkeleton.js
export function NewsSkeleton() {
  return (
    <div className="space-y-6">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="animate-pulse">
          <div className="h-48 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg"></div>
          <div className="mt-4 space-y-2">
            <div className="h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded"></div>
            <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded"></div>
            <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-3/4"></div>
          </div>
        </div>
      ))}
    </div>
  );
}
