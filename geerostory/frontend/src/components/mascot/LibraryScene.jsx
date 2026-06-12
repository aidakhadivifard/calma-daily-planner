import Geero from './Geero';
import { cn } from '../../lib/cn';

const BOOK_COLORS = [
  '#b9a3f7',
  '#f6a8d4',
  '#7fcdff',
  '#ffd57a',
  '#8fd6a8',
  '#ff9d8a',
  '#c2acfb',
];

function Bookshelf({ x, y, width }) {
  const shelfCount = 3;
  const shelfHeight = 34;
  return (
    <g>
      {Array.from({ length: shelfCount }).map((_, row) => {
        const shelfY = y + row * shelfHeight;
        const books = 7;
        const bookWidth = (width - 8) / books;
        return (
          <g key={row}>
            {Array.from({ length: books }).map((__, i) => {
              const h = 20 + ((i * 7 + row * 5) % 10);
              const color = BOOK_COLORS[(i + row * 3) % BOOK_COLORS.length];
              return (
                <rect
                  key={i}
                  x={x + 4 + i * bookWidth}
                  y={shelfY + (shelfHeight - h) - 4}
                  width={bookWidth - 2}
                  height={h}
                  rx={1.5}
                  fill={color}
                  opacity={0.85}
                />
              );
            })}
            <rect x={x} y={shelfY + shelfHeight - 4} width={width} height={4} rx={1} fill="#3a2740" />
          </g>
        );
      })}
    </g>
  );
}

export default function LibraryScene({ pose = 'wave', className = '', geeroSize = 116 }) {
  return (
    <div className={cn('relative w-full overflow-hidden rounded-3xl bg-night-800', className)}>
      <svg viewBox="0 0 400 240" preserveAspectRatio="xMidYMax slice" className="absolute inset-0 h-full w-full">
        <defs>
          <linearGradient id="geero-sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#4a2a5c" />
            <stop offset="100%" stopColor="#1c1230" />
          </linearGradient>
          <linearGradient id="geero-rug" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#e0a35a" />
            <stop offset="100%" stopColor="#c4691b" />
          </linearGradient>
        </defs>
        <rect width="400" height="240" fill="url(#geero-sky)" />
        {/* Arched alcove */}
        <path d="M70 240 V90 a130 130 0 0 1 260 0 V240 Z" fill="#33203f" />
        {/* Bookshelves */}
        <Bookshelf x={86} y={28} width={92} />
        <Bookshelf x={222} y={28} width={92} />
        {/* Center back wall */}
        <rect x={178} y="28" width="44" height="106" rx="4" fill="#2a1a36" />
        {/* Rug */}
        <ellipse cx="200" cy="232" rx="170" ry="26" fill="url(#geero-rug)" opacity="0.9" />
        <ellipse cx="200" cy="232" rx="120" ry="18" fill="#f0c98a" opacity="0.25" />
        {/* Soft glow */}
        <ellipse cx="200" cy="60" rx="120" ry="60" fill="#a78bfa" opacity="0.12" />
      </svg>
      <div className="relative flex h-full items-end justify-center pb-3 pt-16">
        <Geero pose={pose} size={geeroSize} />
      </div>
    </div>
  );
}
