import React from 'react';

interface LogoProps {
  className?: string;
  slashColor?: string;
  textColor?: string;
}

export function Logo({
  className = "",
  slashColor,
  textColor,
}: LogoProps) {
  const isWhite = className.includes("text-white");
  const defaultSlash = isWhite ? "text-[#818CF8]" : "text-[#6366F1]";

  return (
    <div className={`inline-flex items-center gap-1.5 font-bold tracking-[0.16em] select-none text-[15px] sm:text-[16px] leading-none ${className}`}>
      <span className={`${slashColor || defaultSlash} font-mono font-bold leading-none shrink-0 text-[1.15em]`}>
        //
      </span>
      <span className={`font-['Sora',sans-serif] font-bold tracking-[0.18em] uppercase leading-none ${textColor || ""}`}>
        BREXAL
      </span>
    </div>
  );
}

export default Logo;
