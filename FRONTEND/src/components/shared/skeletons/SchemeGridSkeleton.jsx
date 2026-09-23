import React from "react";
import SchemeCardSkeleton from "./SchemeCardSkeleton";

/**
 * SchemeGridSkeleton:
 * 3-Column Grid of SchemeCardSkeleton placeholders.
 */
export function SchemeGridSkeleton({ count = 6 }) {
  const cards = Array.from({ length: count }, (_, i) => i);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 animate-in fade-in duration-150">
      {cards.map((idx) => (
        <SchemeCardSkeleton key={idx} />
      ))}
    </div>
  );
}

export default SchemeGridSkeleton;
