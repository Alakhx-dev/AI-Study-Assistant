export const PandaIcon = ({ size = 32, className = "" }: { size?: number; className?: string }) => {
    return (
        <div className={`relative flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
            {/* Gradient background circle */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-600 via-violet-600 to-blue-500 shadow-lg shadow-purple-500/30 transition-all duration-300 group-hover:shadow-purple-500/50 group-hover:scale-105" />

            {/* Panda SVG */}
            <svg
                viewBox="0 0 24 24"
                fill="white"
                className="relative z-10"
                style={{ width: size * 0.6, height: size * 0.6 }}
            >
                {/* Panda face design */}
                <circle cx="12" cy="12" r="8" fill="white" />
                {/* Left ear */}
                <circle cx="7" cy="6" r="2.5" fill="#1a1a1a" />
                {/* Right ear */}
                <circle cx="17" cy="6" r="2.5" fill="#1a1a1a" />
                {/* Left eye patch */}
                <ellipse cx="9" cy="11" rx="2" ry="2.5" fill="#1a1a1a" />
                {/* Right eye patch */}
                <ellipse cx="15" cy="11" rx="2" ry="2.5" fill="#1a1a1a" />
                {/* Left eye */}
                <circle cx="9" cy="11" r="0.8" fill="white" />
                {/* Right eye */}
                <circle cx="15" cy="11" r="0.8" fill="white" />
                {/* Nose */}
                <ellipse cx="12" cy="14" rx="1.2" ry="0.8" fill="#1a1a1a" />
                {/* Mouth smile */}
                <path d="M 10 15.5 Q 12 17 14 15.5" stroke="#1a1a1a" strokeWidth="0.8" fill="none" strokeLinecap="round" />
            </svg>
        </div>
    );
};
