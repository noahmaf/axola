const CircularLoadingSpinner = ({
  color = "#3498db",
  size = 22,
  thickness = 5,
  className,
}: {
  className?: string;
  color?: string;
  size?: number;
  thickness?: number;
}) => {
  const radius = 20;
  const circumference = 2 * Math.PI * radius;

  return (
    <div className={className || ""}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 50 50"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle
          cx="25"
          cy="25"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={thickness}
          strokeDasharray={`${circumference * 0.75} ${circumference}`}
          strokeDashoffset="0"
          strokeLinecap="round"
        >
          <animateTransform
            attributeName="transform"
            type="rotate"
            from="0 25 25"
            to="360 25 25"
            dur="1s"
            repeatCount="indefinite"
          />
        </circle>
      </svg>
    </div>
  );
};

export default CircularLoadingSpinner;
