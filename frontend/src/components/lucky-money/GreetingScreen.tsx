import { motion } from "framer-motion";

interface GreetingConfig {
  role: string;
  message: string;
  name?: string | null;
  theme: {
    background: string;
    primaryColor: string;
    secondaryColor: string;
  };
}

interface GreetingScreenProps {
  config: GreetingConfig;
  onNext: () => void;
}

export const GreetingScreen = ({ config, onNext }: GreetingScreenProps) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-8 text-center relative"
  >
    {/* Animated decorations */}
    <motion.div
      animate={{
        rotate: [0, 10, -10, 10, 0],
      }}
      transition={{ duration: 4, repeat: Infinity }}
      className="absolute top-10 left-4 sm:top-20 sm:left-20 text-4xl sm:text-6xl opacity-50"
    >
      🎋
    </motion.div>
    <motion.div
      animate={{
        rotate: [0, -10, 10, -10, 0],
      }}
      transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
      className="absolute top-10 right-4 sm:top-20 sm:right-20 text-4xl sm:text-6xl opacity-50"
    >
      🎋
    </motion.div>

    <motion.div
      initial={{ scale: 0, rotate: -180 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ delay: 0.2, type: "spring", stiffness: 150 }}
      className="relative"
    >
      <motion.div
        animate={{
          y: [0, -20, 0],
        }}
        transition={{ duration: 2, repeat: Infinity }}
        className="text-6xl sm:text-8xl lg:text-9xl mb-8 drop-shadow-2xl"
      >
        🧧
      </motion.div>

      {/* Sparkles around envelope */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute text-2xl sm:text-3xl"
          style={{
            top: "50%",
            left: "50%",
            transformOrigin: "center",
          }}
          animate={{
            rotate: [i * 60, i * 60 + 360],
            scale: [0, 1, 0],
            x: [0, Math.cos((i * 60 * Math.PI) / 180) * 60],
            y: [0, Math.sin((i * 60 * Math.PI) / 180) * 60],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: i * 0.2,
          }}
        >
          ✨
        </motion.div>
      ))}
    </motion.div>

    <motion.h1
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.4 }}
      className="text-3xl sm:text-5xl md:text-6xl font-bold text-white mb-6 drop-shadow-2xl px-4"
    >
      🎊 Chúc Mừng Năm Mới! 🎊
    </motion.h1>

    {config.name && (
      <motion.p
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-xl sm:text-2xl md:text-3xl text-yellow-200 font-semibold mb-4 drop-shadow-lg"
      >
        Xin chào, {config.name}! 🌸
      </motion.p>
    )}

    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.6 }}
      className="bg-white/10 backdrop-blur-md rounded-3xl p-4 sm:p-8 mb-12 max-w-2xl border-2 border-white/20 shadow-2xl mx-4"
    >
      <p className="text-lg sm:text-xl md:text-2xl text-white drop-shadow-lg leading-relaxed">
        {config.message}
      </p>
    </motion.div>

    <motion.button
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ delay: 0.8, type: "spring", stiffness: 200 }}
      whileHover={{ scale: 1.1, rotate: [0, -5, 5, -5, 0] }}
      whileTap={{ scale: 0.9 }}
      onClick={onNext}
      className="relative bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 text-red-700 font-bold text-lg sm:text-xl lg:text-2xl px-8 sm:px-12 lg:px-16 py-3 sm:py-4 lg:py-5 rounded-full shadow-2xl hover:shadow-3xl transition-all overflow-hidden group"
    >
      <span className="relative z-10 flex items-center gap-3">
        🎁 Nhận Lì Xì Ngay 🎁
      </span>

      {/* Button shine effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-50"
        animate={{
          x: ["-200%", "200%"],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          repeatDelay: 1,
        }}
      />
    </motion.button>

    {/* Floating lucky words */}
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {["福", "春", "財"].map((char, i) => (
        <motion.div
          key={char}
          className="absolute text-6xl text-yellow-400/30 font-bold"
          style={{
            left: `${20 + i * 30}%`,
            top: "50%",
          }}
          animate={{
            y: [0, -100, 0],
            rotate: [0, 360],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            delay: i * 2,
          }}
        >
          {char}
        </motion.div>
      ))}
    </div>
  </motion.div>
);
