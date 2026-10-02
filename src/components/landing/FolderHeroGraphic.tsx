'use client';

import React from 'react';
import Image from 'next/image';

interface FolderHeroGraphicProps {
  useVector?: boolean;
  className?: string;
}

export default function FolderHeroGraphic({ useVector = false, className = '' }: FolderHeroGraphicProps) {
  if (useVector) {
    return (
      <div className={`relative w-full max-w-[440px] aspect-[4/3] flex items-center justify-center select-none ${className}`}>
        {/* Soft background blue ambient glow */}
        <div className="absolute -inset-4 bg-blue-600/20 blur-3xl rounded-full pointer-events-none" />

        {/* Vector 3D Folder SVG */}
        <svg
          viewBox="0 0 420 320"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-2xl relative z-10 transition-transform duration-500 hover:scale-105"
        >
          <defs>
            <linearGradient id="folderBackGrad" x1="80" y1="20" x2="360" y2="260" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#1E45FF" />
              <stop offset="100%" stopColor="#1036E0" />
            </linearGradient>

            <linearGradient id="folderFrontGrad" x1="30" y1="90" x2="320" y2="290" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#2550FF" />
              <stop offset="60%" stopColor="#1D42FC" />
              <stop offset="100%" stopColor="#0B30EB" />
            </linearGradient>

            <filter id="docShadow" x="-10%" y="-10%" width="120%" height="120%">
              <feDropShadow dx="3" dy="3" stdDeviation="5" floodColor="#050C30" floodOpacity="0.3" />
            </filter>

            <filter id="bottomShadow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="10" />
            </filter>
          </defs>

          {/* Ambient Ground Shadow */}
          <ellipse cx="210" cy="300" rx="160" ry="14" fill="#000000" fillOpacity="0.5" filter="url(#bottomShadow)" />

          {/* Back folder body */}
          <g id="back-folder">
            {/* Top tab */}
            <path
              d="M 85 45 C 85 36 92 30 102 30 L 160 30 C 168 30 174 35 178 42 L 186 56 C 188 60 193 62 198 62 L 345 62 C 358 62 368 72 368 85 L 368 250 C 368 262 358 272 345 272 L 95 272 C 82 272 72 262 72 250 L 72 65 C 72 54 80 45 85 45 Z"
              fill="url(#folderBackGrad)"
            />
          </g>

          {/* Stacked White Documents */}
          <g id="documents">
            {/* Document Layer 1 (Back) */}
            <rect
              x="78"
              y="58"
              width="272"
              height="200"
              rx="14"
              fill="#DCE3EC"
              transform="rotate(0.5 214 158)"
            />

            {/* Document Layer 2 */}
            <rect
              x="75"
              y="52"
              width="276"
              height="205"
              rx="15"
              fill="#EBF0F7"
              transform="rotate(1.2 213 154)"
            />

            {/* Document Layer 3 */}
            <rect
              x="72"
              y="46"
              width="280"
              height="210"
              rx="16"
              fill="#F5F8FC"
              transform="rotate(2 212 151)"
            />

            {/* Main Front Document (Pure White with sleek lines) */}
            <g transform="rotate(3 210 148)" filter="url(#docShadow)">
              <rect x="68" y="38" width="284" height="215" rx="18" fill="#FFFFFF" />
              {/* Subtle Document Content Lines */}
              <rect x="94" y="66" width="100" height="10" rx="5" fill="#E2E8F0" />
              <rect x="94" y="86" width="200" height="8" rx="4" fill="#F1F5F9" />
              <rect x="94" y="102" width="170" height="8" rx="4" fill="#F1F5F9" />
              <rect x="94" y="118" width="190" height="8" rx="4" fill="#F1F5F9" />
              <rect x="94" y="134" width="130" height="8" rx="4" fill="#F1F5F9" />

              {/* Blue Document Badge */}
              <circle cx="280" cy="71" r="14" fill="#2563EB" fillOpacity="0.15" />
              <path d="M 275 71 L 278 74 L 286 67" stroke="#2563EB" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </g>
          </g>

          {/* Front Tilted Folder Flap (Perspective trapezoid with rounded corners) */}
          <g id="front-flap" filter="url(#docShadow)">
            <path
              d="M 18 102 
                 C 14 96 17 88 25 87 
                 L 262 86 
                 C 278 86 293 96 298 111 
                 L 338 248 
                 C 342 262 332 276 317 276 
                 L 76 278 
                 C 66 278 57 271 54 261 
                 L 18 102 Z"
              fill="url(#folderFrontGrad)"
            />
            {/* Subtle flap highlight reflection along the top curve */}
            <path
              d="M 28 92 L 260 91 C 274 91 286 99 291 112 L 297 132"
              stroke="#60A5FA"
              strokeWidth="2"
              strokeLinecap="round"
              strokeOpacity="0.4"
            />
          </g>
        </svg>
      </div>
    );
  }

  // Native High-Precision Rendering matching the screenshot exactly
  return (
    <div className={`relative w-full max-w-[420px] aspect-[4/3] flex items-center justify-center select-none group ${className}`}>
      {/* Background Soft Blue Ambient Glow */}
      <div className="absolute -inset-6 bg-blue-600/25 blur-3xl rounded-full pointer-events-none group-hover:bg-blue-600/35 transition-all duration-700" />

      {/* Hero 3D Folder Illustration Image */}
      <div className="relative z-10 w-full h-full flex items-center justify-center transition-transform duration-500 ease-out group-hover:scale-105 group-hover:-rotate-1">
        <Image
          src="/images/folder-hero-raw.png"
          alt="3D Secure Folder Illustration"
          width={360}
          height={270}
          priority
          className="w-full h-auto object-contain max-h-[300px] drop-shadow-[0_20px_40px_rgba(0,0,0,0.6)] rounded-2xl"
          unoptimized
        />
      </div>
    </div>
  );
}
