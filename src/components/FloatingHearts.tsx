import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useTheme } from "@/context/ThemeContext";

export const FloatingHearts = () => {
    const { themeId } = useTheme();

    // Only render if theme is rose-romance
    if (themeId !== "rose-romance") return null;

    return (
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
            {/* Generate 15 floating hearts/petals with random positions and delays */}
            {Array.from({ length: 15 }).map((_, i) => (
                <Heart key={i} index={i} />
            ))}
        </div>
    );
};

const Heart = ({ index }: { index: number }) => {
    // Randomize initial position and animation properties
    const [props, setProps] = useState({
        left: Math.random() * 100,
        delay: Math.random() * 5,
        duration: 15 + Math.random() * 10,
        size: 10 + Math.random() * 20,
        opacity: 0.1 + Math.random() * 0.2, // Very low opacity for subtlety
    });

    // Re-calculate on mount to avoid hydration mismatch (if SSR were used, though this is SPA)
    useEffect(() => {
        setProps({
            left: Math.random() * 100,
            delay: Math.random() * 5,
            duration: 15 + Math.random() * 10,
            size: 10 + Math.random() * 20,
            opacity: 0.1 + Math.random() * 0.2,
        });
    }, []);

    return (
        <motion.div
            initial={{
                y: "110vh",
                x: `${props.left}vw`,
                opacity: 0,
                rotate: 0,
                scale: 0.5
            }}
            animate={{
                y: "-10vh",
                opacity: [0, props.opacity, props.opacity, 0], // Fade in, hold, fade out
                rotate: [0, 45, -45, 0], // Gentle sway
                x: [`${props.left}vw`, `${props.left + (Math.random() * 10 - 5)}vw`] // Slight drift
            }}
            transition={{
                duration: props.duration,
                repeat: Infinity,
                delay: props.delay,
                ease: "linear",
            }}
            style={{
                width: props.size,
                height: props.size,
                position: "absolute",
                filter: "blur(1px)", // Soft edge
            }}
            className="text-pink-300"
        >
            <svg
                viewBox="0 0 24 24"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
                className="w-full h-full"
            >
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
        </motion.div>
    );
};
