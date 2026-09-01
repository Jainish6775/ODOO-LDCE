import './Skeleton.css';

export function Skeleton({ className = '', style = {}, variant = 'text', width, height }) {
  const customStyle = {
    ...(width ? { width } : {}),
    ...(height ? { height } : {}),
    ...style,
  };

  const variantClass = variant === 'title' 
    ? 'skeleton-title' 
    : variant === 'rect' 
    ? 'skeleton-rect' 
    : variant === 'circle' 
    ? 'skeleton-circle' 
    : 'skeleton-text';

  return <div className={`skeleton ${variantClass} ${className}`} style={customStyle} />;
}

export function SkeletonCard({ count = 1 }) {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="skeleton-card">
          <Skeleton variant="rect" height={160} />
          <Skeleton variant="title" width="70%" />
          <Skeleton variant="text" width="90%" />
          <Skeleton variant="text" width="40%" />
        </div>
      ))}
    </>
  );
}

export default Skeleton;
