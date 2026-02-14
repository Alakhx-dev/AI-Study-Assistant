// 8 Premium Theme definitions — CSS-driven
export type ThemeId =
    | "neon-orbit"
    | "quantum-dark"
    | "aurora-flow"
    | "midnight-sapphire"
    | "cyber-pulse"
    | "ivory-glass"
    | "emerald-luxe"
    | "rose-romance";

export interface ThemeConfig {
    id: ThemeId;
    name: string;
    nameHi: string; // Keeping Hindi names support
    preview: string; // gradient preview for the selector
}

export const themes: ThemeConfig[] = [
    {
        id: "neon-orbit",
        name: "Neon Orbit",
        nameHi: "नियॉन ऑर्बिट",
        preview: "linear-gradient(135deg, #0a0a1a 0%, #7b2cff 50%, #00d4ff 100%)",
    },
    {
        id: "quantum-dark",
        name: "Quantum Dark",
        nameHi: "क्वांटम डार्क",
        preview: "linear-gradient(135deg, #111111 0%, #222222 50%, #333333 100%)",
    },
    {
        id: "aurora-flow",
        name: "Aurora Flow",
        nameHi: "ओरोरा फ्लो",
        preview: "linear-gradient(135deg, #051015 0%, #00c6ff 50%, #00ff99 100%)",
    },
    {
        id: "midnight-sapphire",
        name: "Midnight Sapphire",
        nameHi: "मिडनाइट सैफायर",
        preview: "linear-gradient(135deg, #020410 0%, #102040 50%, #305090 100%)",
    },
    {
        id: "cyber-pulse",
        name: "Cyber Pulse",
        nameHi: "साइबर पल्स",
        preview: "linear-gradient(135deg, #000000 0%, #1a1a1a 50%, #00ff00 100%)",
    },
    {
        id: "ivory-glass",
        name: "Ivory Glass",
        nameHi: "आइवरी ग्लास",
        preview: "linear-gradient(135deg, #f8f9fa 0%, #e9ecef 50%, #dee2e6 100%)",
    },
    {
        id: "emerald-luxe",
        name: "Emerald Luxe",
        nameHi: "एमराल्ड लक्स",
        preview: "linear-gradient(135deg, #05150a 0%, #104020 50%, #208040 100%)",
    },
    {
        id: "rose-romance",
        name: "Rose Romance",
        nameHi: "रोज़ रोमांस",
        preview: "linear-gradient(135deg, #fff0f5 0%, #ffc0cb 50%, #ff69b4 100%)",
    },
];

export const DEFAULT_THEME: ThemeId = "neon-orbit";
