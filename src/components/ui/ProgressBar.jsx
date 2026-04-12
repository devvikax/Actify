import './ProgressBar.css';

export default function ProgressBar({
  value = 0,
  variant = 'primary',
  size = 'md',
  showLabel = false,
  animated = false,
  className = '',
  ...props
}) {
  const clampedValue = Math.min(100, Math.max(0, value));

  const classes = [
    'progress',
    `progress-${variant}`,
    `progress-${size}`,
    animated ? 'progress-animated' : '',
    className,
  ].filter(Boolean).join(' ');

  return (
    <div className={classes} {...props}>
      <div className="progress-track">
        <div
          className="progress-fill"
          style={{ width: `${clampedValue}%` }}
          role="progressbar"
          aria-valuenow={clampedValue}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>
      {showLabel && (
        <span className="progress-label">{Math.round(clampedValue)}%</span>
      )}
    </div>
  );
}
