export default function Loading() {
  return (
    <div className="animate-pulse">
      {/* Skeleton untuk form */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <div className="h-6 bg-gray-300 rounded w-1/3 mb-6"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="h-10 bg-gray-300 rounded"></div>
          <div className="h-10 bg-gray-300 rounded"></div>
          <div className="h-10 bg-gray-300 rounded"></div>
          <div className="h-10 bg-gray-300 rounded"></div>
          <div className="md:col-span-2 h-24 bg-gray-300 rounded"></div>
        </div>
      </div>

      {/* Skeleton untuk tabel */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="p-4 border-b">
          <div className="h-6 bg-gray-300 rounded w-1/4"></div>
        </div>
        <div className="space-y-2 p-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center space-x-4 p-2">
              <div className="h-10 w-10 bg-gray-300 rounded-md"></div>
              <div className="h-4 bg-gray-300 rounded w-1/4"></div>
              <div className="h-4 bg-gray-300 rounded w-1/6"></div>
              <div className="h-4 bg-gray-300 rounded w-1/6"></div>
              <div className="h-4 bg-gray-300 rounded flex-grow"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}