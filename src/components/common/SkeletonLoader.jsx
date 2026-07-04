// src/components/common/SkeletonLoader.jsx
const SkeletonBox = ({ className = '' }) => (
    <div className={`animate-pulse bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] rounded-lg ${className}`}
         style={{
           animation: 'shimmer 1.5s infinite',
         }}
    />
  );
  
  export const PropertySkeleton = () => (
    <div className="property-card animate-fade-in">
      <SkeletonBox className="h-64 w-full rounded-none" />
      <div className="p-5 space-y-4">
        <SkeletonBox className="h-6 w-3/4" />
        <SkeletonBox className="h-4 w-1/2" />
        <div className="flex gap-2">
          <SkeletonBox className="h-6 w-20 rounded-full" />
          <SkeletonBox className="h-6 w-20 rounded-full" />
        </div>
        <div className="grid grid-cols-3 gap-3">
          <SkeletonBox className="h-16" />
          <SkeletonBox className="h-16" />
          <SkeletonBox className="h-16" />
        </div>
        <div className="flex justify-between pt-4 border-t">
          <SkeletonBox className="h-8 w-32" />
          <SkeletonBox className="h-10 w-24 rounded-xl" />
        </div>
      </div>
    </div>
  );
  
  export const DashboardSkeleton = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded-2xl p-6 animate-pulse">
            <div className="flex justify-between">
              <div className="space-y-2 flex-1">
                <SkeletonBox className="h-4 w-24" />
                <SkeletonBox className="h-8 w-16" />
              </div>
              <SkeletonBox className="h-12 w-12 rounded-xl" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );