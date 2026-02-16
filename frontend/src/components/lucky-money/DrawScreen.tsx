import { motion } from "framer-motion";
import { useMemo } from "react";
import { generateConfettiPositions } from "../../utils/randomPositions";

interface DrawScreenProps {
  isDrawing: boolean;
  showConfetti: boolean;
  wonAmount: number;
  totalEnvelopes: number;
  onDraw: () => void;
}

export const DrawScreen = ({
  isDrawing,
  showConfetti,
  wonAmount,
  totalEnvelopes,
  onDraw,
}: DrawScreenProps) => {
  const confettiPositions = useMemo(() => generateConfettiPositions(50), []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-8 relative"
    >
      {!isDrawing && !showConfetti && (
        <motion.div className="text-center max-w-6xl w-full">
          <motion.h2
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-2xl sm:text-3xl lg:text-4xl text-white font-bold mb-4 drop-shadow-lg px-4"
          >
            Chọn lì xì may mắn của bạn 🏮
          </motion.h2>
          <p className="text-white text-base sm:text-lg lg:text-xl mb-8 sm:mb-12 drop-shadow px-4">
            {totalEnvelopes} lì xì đang chờ bạn!
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6 justify-items-center px-4">
            {Array.from({ length: totalEnvelopes }).map((_, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0, rotate: -180 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{
                  delay: index * 0.1,
                  type: "spring",
                  stiffness: 200,
                }}
                whileHover={{ scale: 1.1, rotate: 5, y: -10 }}
                whileTap={{ scale: 0.9 }}
                onClick={onDraw}
                className="cursor-pointer group"
              >
                <div className="relative">
                  {/* Red Envelope */}
                  <div className="w-24 h-36 sm:w-28 sm:h-40 lg:w-32 lg:h-48 bg-gradient-to-br from-red-500 via-red-600 to-red-800 rounded-xl sm:rounded-2xl shadow-2xl flex flex-col items-center justify-center border-2 sm:border-4 border-yellow-400 group-hover:border-yellow-300 transition-all">
                    {/* Decorative pattern */}
                    <div className="absolute inset-0 opacity-20">
                      <div className="absolute top-2 sm:top-4 left-1/2 transform -translate-x-1/2 text-yellow-400 text-lg sm:text-2xl">
                        福
                      </div>
                    </div>

                    {/* Envelope icon */}
                    <div className="text-4xl sm:text-5xl lg:text-6xl mb-1 sm:mb-2 group-hover:scale-110 transition-transform">
                      🧧
                    </div>

                    {/* Lucky number label */}
                    <div className="absolute bottom-1 sm:bottom-2 bg-yellow-400 text-red-800 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs font-bold">
                      #{index + 1}
                    </div>
                  </div>

                  {/* Shine effect */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-30 pointer-events-none rounded-2xl"
                    animate={{
                      x: ["-100%", "100%"],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      repeatDelay: 3,
                    }}
                  />
                </div>
              </motion.div>
            ))}
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: totalEnvelopes * 0.1 + 0.5 }}
            className="text-white text-base sm:text-lg mt-8 sm:mt-12 drop-shadow animate-pulse px-4"
          >
            ✨ Chọn một lì xì may mắn để mở ! ✨
          </motion.p>
        </motion.div>
      )}

      {isDrawing && !showConfetti && (
        <motion.div className="text-center px-4">
          <motion.div
            animate={{
              rotate: [0, -10, 10, -10, 10, 0],
              scale: [1, 1.1, 0.9, 1.1, 0.9, 1],
            }}
            transition={{ duration: 0.6, repeat: 2 }}
            className="w-32 h-48 sm:w-40 sm:h-60 bg-gradient-to-br from-red-500 via-red-600 to-red-800 rounded-3xl shadow-2xl flex items-center justify-center border-4 border-yellow-400 mx-auto"
          >
            <div className="text-6xl sm:text-8xl">🧧</div>
          </motion.div>
          <p className="text-white text-lg sm:text-2xl mt-6 sm:mt-8 font-semibold drop-shadow-lg animate-pulse">
            Đang mở lì xì...
          </p>
        </motion.div>
      )}

      {showConfetti && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200 }}
          className="text-center relative z-10"
        >
          <motion.div
            animate={{ rotate: [0, 10, -10, 10, -10, 0] }}
            transition={{ duration: 0.8, repeat: Infinity }}
            className="text-9xl mb-8"
          >
            🎊
          </motion.div>

          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-2xl"
          >
            <p className="text-2xl font-semibold text-tet-red-600 mb-4">
              Chúc mừng bạn nhận được
            </p>
            <motion.h1
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
              className="text-7xl font-bold bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 bg-clip-text text-transparent mb-4 pb-1"
            >
              {wonAmount.toLocaleString("vi-VN")} đ
            </motion.h1>
            <p className="text-xl text-gray-700 font-semibold">
              💰 Lì xì may mắn! 💰
            </p>
          </motion.div>

          {/* Enhanced Confetti Effect */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {confettiPositions.map((pos, i) => (
              <motion.div
                key={i}
                initial={{ y: "50%", x: "50%", opacity: 1, scale: 0 }}
                animate={{
                  y: [null, "-100vh"],
                  x: [null, `${pos.x}vw`],
                  rotate: [0, pos.rotate],
                  opacity: [1, 1, 0],
                  scale: [0, 1, 1],
                }}
                transition={{
                  duration: pos.duration,
                  delay: pos.delay,
                  ease: "easeOut",
                }}
                className={`absolute ${
                  i % 4 === 0
                    ? "bg-yellow-400"
                    : i % 4 === 1
                      ? "bg-red-500"
                      : i % 4 === 2
                        ? "bg-yellow-500"
                        : "bg-red-600"
                } ${i % 3 === 0 ? "rounded-full" : ""}`}
                style={{
                  width: i % 3 === 0 ? "12px" : "8px",
                  height: i % 3 === 0 ? "12px" : "20px",
                  left: "50%",
                  top: "50%",
                }}
              />
            ))}

            {/* Money rain */}
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={`money-${i}`}
                initial={{ y: "-10vh", x: `${i * 5}%`, opacity: 0 }}
                animate={{
                  y: "110vh",
                  opacity: [0, 1, 1, 0],
                  rotate: [0, 360, 720],
                }}
                transition={{
                  duration: 3,
                  delay: Math.random() * 0.5,
                  ease: "linear",
                }}
                className="absolute text-4xl"
              >
                💵
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};
