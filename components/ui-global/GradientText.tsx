interface GradientTextProps {
    children: React.ReactNode;
    className?: string;
  }
  
  export default function GradientText({
    children,
    className = "",
  }: GradientTextProps) {
    return (
      <span
        className={`bg-gradient-to-r from-blue-500 via-purple-200 to-pink-300 text-transparent bg-clip-text ${className}`}
      >
        {children}
      </span>
    );
  }
  