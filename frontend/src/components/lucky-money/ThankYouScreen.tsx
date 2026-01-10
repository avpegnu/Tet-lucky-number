import { motion } from "framer-motion";
import { useMemo } from "react";
import { generateRandomPositions } from "../../utils/randomPositions";

interface BankInfo {
  bankName: string;
  accountNumber: string;
}

interface ThankYouScreenProps {
  wonAmount: number;
  bankInfo: BankInfo;
}

export const ThankYouScreen = ({
  wonAmount,
  bankInfo,
}: ThankYouScreenProps) => {
  const fireworksPositions = useMemo(() => generateRandomPositions(30), []);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen flex items-center justify-center p-4 sm:p-8 relative overflow-hidden"
    >
      {/* Fireworks background */}
      <div className="absolute inset-0 pointer-events-none">
        {fireworksPositions.map((pos, i) => (
          <motion.div
            key={i}
            className="absolute"
            style={{
              left: `${pos.left}%`,
              top: `${pos.top}%`,
            }}
            initial={{ scale: 0, opacity: 1 }}
            animate={{
              scale: [0, 2, 0],
              opacity: [1, 0.8, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: pos.delay,
            }}
          >
            <div className="text-2xl sm:text-4xl">
              {["🎆", "🎇", "✨", "🌟", "💫"][i % 5]}
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ scale: 0.5, rotateY: -180 }}
        animate={{ scale: 1, rotateY: 0 }}
        transition={{ type: "spring", stiffness: 150 }}
        className="bg-gradient-to-br from-white to-yellow-50 rounded-2xl sm:rounded-3xl shadow-2xl p-6 sm:p-10 lg:p-12 max-w-lg w-full text-center relative z-10 border-2 sm:border-4 border-yellow-400"
      >
        {/* Success icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1, rotate: [0, -10, 10, -10, 0] }}
          transition={{ delay: 0.3, type: "spring" }}
          className="text-6xl sm:text-7xl lg:text-8xl mb-4 sm:mb-6"
        >
          🎊
        </motion.div>

        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-red-600 to-yellow-500 bg-clip-text text-transparent mb-3 sm:mb-4"
        >
          Hoàn tất!
        </motion.h1>

        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-base sm:text-lg lg:text-xl text-gray-700 mb-6 sm:mb-8"
        >
          ✅ Thông tin của bạn đã được gửi thành công
        </motion.p>

        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.6, type: "spring" }}
          className="bg-gradient-to-br from-red-50 to-yellow-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-6 border-2 border-yellow-300 shadow-inner"
        >
          <div>
            <p className="text-xs sm:text-sm text-gray-600 mb-2 font-semibold">
              💰 Số tiền nhận được
            </p>
            <motion.p
              animate={{
                scale: [1, 1.05, 1],
              }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-yellow-500 via-yellow-600 to-yellow-500 bg-clip-text text-transparent"
            >
              {wonAmount.toLocaleString("vi-VN")} đ
            </motion.p>
          </div>

          <div className="border-t-2 border-yellow-200 pt-4 sm:pt-6">
            <p className="text-xs sm:text-sm text-gray-600 mb-2 sm:mb-3 font-semibold flex items-center justify-center gap-2">
              🏦 Thông tin ngân hàng
            </p>
            <div className="bg-white rounded-xl p-3 sm:p-4 shadow">
              <p className="font-bold text-gray-800 text-base sm:text-lg">
                {bankInfo.bankName}
              </p>
              <p className="text-gray-600 text-base sm:text-lg font-mono">
                {bankInfo.accountNumber}
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-6 sm:mt-8 bg-gradient-to-r from-red-100 to-yellow-100 rounded-xl p-3 sm:p-4"
        >
          <p className="text-gray-700 font-semibold text-base sm:text-lg">
            🎁 Admin sẽ chuyển tiền cho bạn sớm nhất!
          </p>
          <p className="text-gray-600 text-sm sm:text-base mt-1 sm:mt-2">
            Chúc bạn năm mới vui vẻ, an khang thịnh vượng! 🧧
          </p>
        </motion.div>

        {/* Corner decorations */}
        {["🎋", "🏮", "🧧", "🎊"].map((emoji, i) => (
          <motion.div
            key={i}
            className="absolute text-4xl"
            style={{
              top: i < 2 ? "1rem" : "auto",
              bottom: i >= 2 ? "1rem" : "auto",
              left: i % 2 === 0 ? "1rem" : "auto",
              right: i % 2 === 1 ? "1rem" : "auto",
            }}
            animate={{
              rotate: [0, 10, -10, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: i * 0.5,
            }}
          >
            {emoji}
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
};
