import { useState, useEffect } from "react";

interface LiveClockProps {
  showSeconds?: boolean;
  showDate?: boolean;
  className?: string;
  variant?: "default" | "compact" | "detailed";
}

const LiveClock: React.FC<LiveClockProps> = ({ 
  showSeconds = true, 
  showDate = false, 
  className = "",
  variant = "default"
}) => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    };

    if (showSeconds) {
      options.second = '2-digit';
    }

    return date.toLocaleTimeString('en-US', options);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  const getVariantStyles = () => {
    switch (variant) {
      case "compact":
        return "text-xs bg-white/5 px-2 py-1 rounded";
      case "detailed":
        return "text-sm bg-white/10 px-4 py-2 rounded-lg border border-white/20";
      default:
        return "text-sm text-gray-300 bg-white/5 px-3 py-1 rounded-md";
    }
  };

  return (
    <div className={`flex items-center space-x-2 ${getVariantStyles()} ${className}`}>
      {/* Inline clock icon to avoid external icon runtime issues */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-4 w-4 text-comic-softBlue"
      >
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
      <div className="flex flex-col">
        <span className="font-mono">{formatTime(currentTime)}</span>
        {showDate && (
          <span className="text-xs text-gray-400 font-mono">
            {formatDate(currentTime)}
          </span>
        )}
      </div>
    </div>
  );
};

export default LiveClock;
