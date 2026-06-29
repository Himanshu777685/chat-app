import React from 'react'
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const SideBarSkeleton = () => {
 return (
        <div className="space-y-4 p-4">
            {Array.from({ length: 8 }).map((_, i) => (
                <div
                    key={i}
                    className="flex items-center gap-3"
                >
                    <Skeleton circle width={48} height={48} />

                    <div className="flex-1">
                        <Skeleton height={18} width="70%" />
                        <Skeleton height={14} width="40%" />
                    </div>
                </div>
            ))}
        </div>
    );
}

export default SideBarSkeleton
