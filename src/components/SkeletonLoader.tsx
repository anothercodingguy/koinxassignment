import React from "react";

export const CardSkeleton: React.FC = () => {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-brand-borderDark bg-brand-cardDark/80 p-6 shadow-xl backdrop-blur-md">
      <div className="absolute inset-0 -translate-x-full animate-shimmer shimmer-bg opacity-10"></div>
      <div className="h-6 w-32 rounded bg-brand-cardLight/50 mb-6"></div>
      <div className="space-y-4">
        <div className="flex justify-between border-b border-brand-borderDark/40 pb-3">
          <div className="h-4 w-20 rounded bg-brand-cardLight/50"></div>
          <div className="h-4 w-16 rounded bg-brand-cardLight/50"></div>
        </div>
        <div className="flex justify-between">
          <div className="h-4 w-24 rounded bg-brand-cardLight/30"></div>
          <div className="h-4 w-12 rounded bg-brand-cardLight/30"></div>
        </div>
        <div className="flex justify-between pb-3 border-b border-brand-borderDark/40">
          <div className="h-4 w-24 rounded bg-brand-cardLight/30"></div>
          <div className="h-4 w-12 rounded bg-brand-cardLight/30"></div>
        </div>
        <div className="flex justify-between pt-2">
          <div className="h-5 w-24 rounded bg-brand-cardLight/50"></div>
          <div className="h-5 w-20 rounded bg-brand-cardLight/50"></div>
        </div>
      </div>
    </div>
  );
};

export const TableSkeleton: React.FC = () => {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-brand-borderDark bg-brand-cardDark/50 p-6 shadow-xl backdrop-blur-md">
      <div className="absolute inset-0 -translate-x-full animate-shimmer shimmer-bg opacity-10"></div>
      <div className="flex items-center justify-between mb-6">
        <div className="h-10 w-64 rounded-lg bg-brand-cardLight/50"></div>
        <div className="h-8 w-28 rounded-lg bg-brand-cardLight/50"></div>
      </div>
      <div className="space-y-4">
        {/* Table Header mock */}
        <div className="grid grid-cols-6 gap-4 border-b border-brand-borderDark/60 pb-3">
          <div className="h-4 rounded bg-brand-cardLight/50 col-span-2"></div>
          <div className="h-4 rounded bg-brand-cardLight/50"></div>
          <div className="h-4 rounded bg-brand-cardLight/50"></div>
          <div className="h-4 rounded bg-brand-cardLight/50"></div>
          <div className="h-4 rounded bg-brand-cardLight/50"></div>
        </div>
        {/* Table Rows mock */}
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="grid grid-cols-6 gap-4 border-b border-brand-borderDark/30 py-3">
            <div className="flex items-center space-x-3 col-span-2">
              <div className="h-8 w-8 rounded-full bg-brand-cardLight/50"></div>
              <div className="space-y-2 flex-1">
                <div className="h-3 w-20 rounded bg-brand-cardLight/50"></div>
                <div className="h-2 w-12 rounded bg-brand-cardLight/30"></div>
              </div>
            </div>
            <div className="h-4 rounded bg-brand-cardLight/30 self-center"></div>
            <div className="h-4 rounded bg-brand-cardLight/30 self-center"></div>
            <div className="h-4 rounded bg-brand-cardLight/30 self-center"></div>
            <div className="h-4 rounded bg-brand-cardLight/30 self-center"></div>
          </div>
        ))}
      </div>
    </div>
  );
};
