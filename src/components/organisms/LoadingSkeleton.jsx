import React from 'react';

const LoadingSkeleton = () => {
    return (
        <div className="p-6 space-y-6">
            <div className="animate-pulse">
                {/* Welcome header skeleton */}
                <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>

                {/* Stats section skeleton */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="h-24 bg-gray-200 rounded-lg"></div>
                    ))}
                </div>

                {/* Quick Actions & Recent Contacts skeleton */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="h-64 bg-gray-200 rounded-lg"></div>
                    <div className="h-64 bg-gray-200 rounded-lg"></div>
                </div>

                {/* Getting Started skeleton */}
                <div className="mt-8">
                    <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
                    <div className="space-y-3">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="h-8 bg-gray-200 rounded w-full"></div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoadingSkeleton;