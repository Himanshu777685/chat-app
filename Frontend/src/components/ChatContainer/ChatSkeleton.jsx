import React from 'react'
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const ChatSkeleton = () => {
    return (
        <div className="space-y-4 p-4">
            {Array.from({ length: 10 }).map((_, i) => (
                <div
                    key={i}
                    className={`flex ${i % 2 ? "justify-end" : "justify-start"}`}
                >
                    <Skeleton
                        width={220}
                        height={45}
                        borderRadius={20}
                    />
                </div>
            ))}
        </div>
    )
}

export default ChatSkeleton
