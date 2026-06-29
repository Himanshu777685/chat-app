import React from 'react'

const SideBarSkeleton = () => {
    return (
        <div className="w-full">
            {[...Array(8)].map((_, index) => (
                <div
                    key={index}
                    className="flex items-center gap-3 p-3 animate-pulse"
                >
                    {/* Avatar */}
                    <div className="w-12 h-12 rounded-full bg-base-300"></div>

                    {/* User Info */}
                    <div className="flex-1">
                        <div className="h-4 w-32 rounded bg-base-300 mb-2"></div>
                        <div className="h-3 w-20 rounded bg-base-300"></div>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default SideBarSkeleton
