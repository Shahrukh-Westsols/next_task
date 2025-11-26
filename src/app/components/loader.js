export const TaskSkeleton = () => (
  <li className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 flex flex-col gap-4 animate-pulse">
    <div className="flex items-start gap-4">
      <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700 shrink-0"></div>
      <div className="flex-1 min-w-0">
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
      </div>
    </div>
    <div className="flex justify-end gap-2 border-t border-gray-100 dark:border-gray-700 pt-4">
      <div className="h-8 w-10 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
      <div className="h-8 w-10 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
      <div className="h-8 w-20 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
      <div className="h-8 w-10 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
    </div>
  </li>
);

export const ProfileSkeleton = () => (
  <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 border border-gray-100 dark:border-gray-700 animate-pulse">
    <div className="flex flex-col items-center mb-8">
      <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full mb-4"></div>
      <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-32 mb-2"></div>
      <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
    </div>
    <div className="space-y-4 mb-10">
      {[...Array(3)].map((_, index) => (
        <div key={index} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
          <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-16 mb-2"></div>
          <div className="h-6 bg-gray-200 dark:bg-gray-600 rounded w-3/4"></div>
        </div>
      ))}
    </div>
    <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
  </div>
);
