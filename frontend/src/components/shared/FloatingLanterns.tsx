import { motion } from "framer-motion";

const lanternConfigs = [
  // Left side
  { left: 3, sway: [0, 15, -10, 5, 0], duration: 16, delay: 0 },
  { left: 12, sway: [0, -12, 8, -15, 0], duration: 19, delay: 3 },
  { left: 20, sway: [0, 18, -12, 10, 0], duration: 14, delay: 1 },
  // Center
  { left: 35, sway: [0, -10, 15, -8, 0], duration: 18, delay: 5 },
  { left: 48, sway: [0, 12, -18, 10, 0], duration: 15, delay: 2 },
  { left: 58, sway: [0, -15, 10, -12, 0], duration: 20, delay: 7 },
  // Right side
  { left: 72, sway: [0, 14, -10, 16, 0], duration: 17, delay: 4 },
  { left: 80, sway: [0, -18, 12, -8, 0], duration: 14, delay: 1.5 },
  { left: 88, sway: [0, 10, -15, 12, 0], duration: 19, delay: 6 },
  { left: 94, sway: [0, -12, 8, -14, 0], duration: 16, delay: 3.5 },
];

export const FloatingLanterns = () => (
  <div className="absolute inset-0 pointer-events-none overflow-hidden">
    {lanternConfigs.map((config, i) => (
      <motion.div
        key={i}
        className="absolute text-4xl"
        style={{ left: `${config.left}%` }}
        initial={{ y: "100vh" }}
        animate={{
          y: "-20vh",
          x: config.sway,
        }}
        transition={{
          duration: config.duration,
          repeat: Infinity,
          ease: "linear",
          delay: config.delay,
        }}
      >
        🏮
      </motion.div>
    ))}
  </div>
);
