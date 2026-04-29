export default function SkeletonLoader({ type = 'row', count = 1 }) {
  const elements = Array.from({ length: count });

  if (type === 'stat') {
    return (
      <>
        {elements.map((_, idx) => (
          <div key={idx} className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm flex items-center justify-between animate-pulse">
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded w-24"></div>
              <div className="h-8 bg-gray-200 rounded w-16"></div>
            </div>
            <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
          </div>
        ))}
      </>
    );
  }

  // Default is row
  return (
    <div className="w-full flex flex-col gap-4 p-4 animate-pulse">
      {elements.map((_, idx) => (
        <div key={idx} className="flex gap-4 items-center">
          <div className="w-20 h-4 bg-gray-200 rounded"></div>
          <div className="flex-1 h-4 bg-gray-200 rounded"></div>
          <div className="w-32 h-4 bg-gray-200 rounded"></div>
          <div className="w-24 h-8 bg-gray-200 rounded-full"></div>
          <div className="w-24 h-8 bg-gray-200 rounded"></div>
        </div>
      ))}
    </div>
  );
}
