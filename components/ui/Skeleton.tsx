interface SkeletonProps {
  className?: string;
  style?: React.CSSProperties;
}

export function Skeleton({ className = "", style }: SkeletonProps) {
  return (
    <div
      aria-hidden="true"
      style={style}
      className={`animate-pulse rounded-(--radius-ctrl) bg-(--color-surface-soft) ${className}`}
    />
  );
}
