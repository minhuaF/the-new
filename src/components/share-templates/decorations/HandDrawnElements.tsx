'use client';

interface HandDrawnProps {
  className?: string;
  color?: string;
}

// 波浪线装饰
export function WavyLine({ className = '', color = '#FFD97D' }: HandDrawnProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 200 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M2 10 Q 10 5, 20 10 T 40 10 T 60 10 T 80 10 T 100 10 T 120 10 T 140 10 T 160 10 T 180 10 T 198 10"
        stroke={color}
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}

// 虚线装饰
export function DashedLine({ className = '', color = '#FF9E9E' }: HandDrawnProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 200 10"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M5 5 L 195 5"
        stroke={color}
        strokeWidth="2.5"
        strokeDasharray="8 6"
        strokeLinecap="round"
      />
    </svg>
  );
}

// 涂鸦箭头
export function DoodleArrow({ className = '', color = '#A8E6CF' }: HandDrawnProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 100 60"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M 10 30 Q 30 20, 50 30 T 70 30 L 85 30 M 75 20 L 85 30 L 75 40"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}

// 星星贴纸
export function StarSticker({ className = '', color = '#FFD97D' }: HandDrawnProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 60 60"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M30 5 L35 22 L52 25 L40 37 L43 54 L30 45 L17 54 L20 37 L8 25 L25 22 Z"
        fill={color}
        stroke="#F5E6D3"
        strokeWidth="2"
      />
      <circle cx="20" cy="15" r="3" fill="#FFF" opacity="0.6" />
    </svg>
  );
}

// 心形贴纸
export function HeartSticker({ className = '', color = '#FF9E9E' }: HandDrawnProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 60 60"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M30 50 C 10 40, 5 25, 15 15 C 20 10, 25 10, 30 15 C 35 10, 40 10, 45 15 C 55 25, 50 40, 30 50 Z"
        fill={color}
        stroke="#FFE4E8"
        strokeWidth="2"
      />
      <circle cx="22" cy="20" r="4" fill="#FFF" opacity="0.5" />
    </svg>
  );
}

// 圆形贴纸
export function CircleSticker({ className = '', color = '#A8E6CF' }: HandDrawnProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 60 60"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle
        cx="30"
        cy="30"
        r="25"
        fill={color}
        stroke="#E0F4F1"
        strokeWidth="3"
      />
      <circle cx="22" cy="22" r="5" fill="#FFF" opacity="0.6" />
    </svg>
  );
}

// 手绘方框
export function DoodleBox({ className = '', color = '#FF9E9E', children }: HandDrawnProps & { children?: React.ReactNode }) {
  return (
    <div className={`relative ${className}`}>
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M 5 8 Q 5 5, 8 5 L 92 5 Q 95 5, 95 8 L 95 92 Q 95 95, 92 95 L 8 95 Q 5 95, 5 92 Z"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
          opacity="0.5"
        />
      </svg>
      <div className="relative z-10">{children}</div>
    </div>
  );
}

// 涂鸦圆圈（强调）
export function DoodleCircle({ className = '', color = '#FFD97D' }: HandDrawnProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <ellipse
        cx="60"
        cy="60"
        rx="50"
        ry="48"
        stroke={color}
        strokeWidth="3"
        strokeDasharray="5 3"
        fill="none"
        transform="rotate(-5 60 60)"
      />
    </svg>
  );
}

// 彩色下划线（马克笔效果）
export function MarkerUnderline({ className = '', color = '#FFE4E8' }: HandDrawnProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 200 15"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M5 8 Q 50 6, 100 8 T 195 8"
        stroke={color}
        strokeWidth="12"
        strokeLinecap="round"
        opacity="0.6"
      />
    </svg>
  );
}
