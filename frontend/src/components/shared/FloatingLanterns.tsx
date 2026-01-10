import { motion } from "framer-motion";

export const FloatingLanterns = () => (
  <div className="absolute inset-0 pointer-events-none overflow-hidden">
    {[...Array(8)].map((_, i) => (
      <motion.div
        key={i}
        className="absolute text-4xl"
        initial={{ y: "100vh", x: `${i * 12}%` }}
        animate={{
          y: "-20vh",
          x: `${i * 12 + Math.sin(i) * 10}%`,
        }}
        transition={{
          duration: 15 + i * 2,
          repeat: Infinity,
          ease: "linear",
          delay: i * 2,
        }}
      >
        🏮
      </motion.div>
    ))}
  </div>
);
