import { motion } from "framer-motion";

const blossomConfigs = [
  { left: 5, startY: -3, dur: 11, delay: 0, size: "text-xl", sway: [0, 15, -10, 20, -5, 0] },
  { left: 15, startY: -8, dur: 13, delay: 0.3, size: "text-2xl", sway: [0, -12, 18, -8, 10, 0] },
  { left: 25, startY: -2, dur: 9.5, delay: 1.2, size: "text-lg", sway: [0, 20, -15, 10, -20, 0] },
  { left: 38, startY: -6, dur: 12, delay: 0.8, size: "text-xl", sway: [0, -18, 12, -6, 15, 0] },
  { left: 55, startY: -4, dur: 10, delay: 2, size: "text-2xl", sway: [0, 14, -20, 8, -12, 0] },
  { left: 62, startY: -1, dur: 14, delay: 0.5, size: "text-lg", sway: [0, -10, 22, -15, 8, 0] },
  { left: 70, startY: -7, dur: 11.5, delay: 1.8, size: "text-xl", sway: [0, 18, -8, 16, -10, 0] },
  { left: 78, startY: -3, dur: 9, delay: 0.2, size: "text-2xl", sway: [0, -15, 10, -18, 12, 0] },
  { left: 85, startY: -9, dur: 13.5, delay: 1, size: "text-lg", sway: [0, 12, -16, 20, -8, 0] },
  { left: 92, startY: -5, dur: 10.5, delay: 0.7, size: "text-xl", sway: [0, -20, 14, -10, 18, 0] },
  { left: 8, startY: -10, dur: 12.5, delay: 1.5, size: "text-lg", sway: [0, 16, -12, 8, -16, 0] },
  { left: 48, startY: -6, dur: 11, delay: 0.4, size: "text-xl", sway: [0, -14, 18, -12, 6, 0] },
];

export const FallingBlossoms = () => (
  <div className="absolute inset-0 pointer-events-none overflow-hidden">
    {blossomConfigs.map((b, i) => (
      <motion.div
        key={`blossom-${i}`}
        className={`absolute ${b.size} opacity-80`}
        style={{ left: `${b.left}%` }}
        initial={{ y: `${b.startY}%` }}
        animate={{
          y: "110vh",
          x: b.sway,
          rotate: [0, 90, 200, 310, 360],
        }}
        transition={{
          duration: b.dur,
          repeat: Infinity,
          delay: b.delay,
          ease: "linear",
        }}
      >
        🌸
      </motion.div>
    ))}
  </div>
);
