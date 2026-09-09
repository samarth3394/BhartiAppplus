import React from 'react';

export function Logo({ className = "h-5 text-white" }: { className?: string }) {
  return (
    <svg 
      viewBox="0 0 158 24" 
      className={className} 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2.5" 
      strokeLinecap="square" 
      strokeLinejoin="miter"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* B */}
      <path d="M 2 22 V 2 H 12 L 16 6 V 8 L 12 12 H 2 M 12 12 L 16 16 V 18 L 12 22 H 2" />
      
      {/* R */}
      <path d="M 30 22 V 2 H 40 L 44 6 V 8 L 40 12 H 30 M 38 12 L 44 22" />
      
      {/* E (Futuristic with horizontal cuts) */}
      <path d="M 72 2 H 58 V 9" />
      <path d="M 58 12 h 10" />
      <path d="M 58 15 V 22 H 72" />
      
      {/* X */}
      <path d="M 86 2 L 100 22 M 100 2 L 86 22" />
      
      {/* A (Distinctive angular chevron with flat top, no crossbar) */}
      <path d="M 114 22 L 119 2 H 123 L 128 22" />
      
      {/* L */}
      <path d="M 142 2 V 22 H 156" />
    </svg>
  );
}
