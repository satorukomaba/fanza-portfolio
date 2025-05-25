import React from 'react';

type HamburgerMenuProps = { 
  onClick: () => void; 
};

const HamburgerMenu: React.FC<HamburgerMenuProps> = ({ onClick }) => (
  <button
    onClick={onClick}
    className="p-2 bg-white/30 rounded-md backdrop-blur-sm" // Position classes removed, keep styling
    aria-label="メニューを開く"
  >
    {/* シンプルなハンバーガーアイコンSVG */}
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M3 12H21"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M3 6H21"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M3 18H21"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </button>
);

export default HamburgerMenu; 