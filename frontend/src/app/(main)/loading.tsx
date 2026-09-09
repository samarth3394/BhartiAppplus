import React from "react";
import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="w-full h-full flex flex-col gap-6 animate-pulse p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="h-8 bg-white/[0.05] rounded-lg w-1/4"></div>
        <div className="flex gap-3">
          <div className="h-8 w-24 bg-white/[0.05] rounded-lg"></div>
          <div className="h-8 w-32 bg-white/[0.05] rounded-lg"></div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="h-32 bg-white/[0.03] rounded-xl border border-white/[0.02]"></div>
        <div className="h-32 bg-white/[0.03] rounded-xl border border-white/[0.02]"></div>
        <div className="h-32 bg-white/[0.03] rounded-xl border border-white/[0.02]"></div>
      </div>

      <div className="h-64 bg-white/[0.03] rounded-xl border border-white/[0.02] mt-4"></div>
      
      <div className="flex justify-center mt-12 opacity-50">
        <Loader2 className="animate-spin text-[#555]" size={24} />
      </div>
    </div>
  );
}
