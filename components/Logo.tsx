import React from 'react';

export const Logo: React.FC<{ className?: string }> = ({ className = "w-10 h-10" }) => (
  <svg viewBox="0 0 378 378" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="ribbonGradient" x1="57" y1="293" x2="209" y2="185" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#395761" />
        <stop offset="25%" stopColor="#425A63" />
        <stop offset="50%" stopColor="#626E5F" />
        <stop offset="75%" stopColor="#9C8B50" />
        <stop offset="100%" stopColor="#D9AA43" />
      </linearGradient>
    </defs>
    
    {/* Body of the A (Gold) */}
    <path 
      d="M182 80 L322 297 L250 297 L210 200 L182 80 Z" 
      fill="#D9AA43"
    />
    
    {/* The Ribbon (Gradient) */}
    <path 
      d="M57 293 C80 250, 140 180, 209 185 L210 200 C150 210, 100 280, 57 293 Z" 
      fill="url(#ribbonGradient)" 
    />
    
    {/* Upper part of A connecting to ribbon visually */}
    <path
        d="M182 80 L130 200 C160 190, 190 190, 210 200 L182 80 Z"
        fill="#D9AA43"
    />

  </svg>
);