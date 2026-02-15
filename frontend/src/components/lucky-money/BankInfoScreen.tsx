import { motion } from "framer-motion";
import type { FormEvent } from "react";
import { useMemo } from "react";
import { generateRandomPositions } from "../../utils/randomPositions";

interface BankForm {
  bankName: string;
  accountNumber: string;
  accountName: string;
}

interface BankInfoScreenProps {
  wonAmount: number;
  bankForm: BankForm;
  setBankForm: (form: BankForm) => void;
  onSubmit: (e: FormEvent) => void;
}

export const BankInfoScreen = ({
  wonAmount,
  bankForm,
  setBankForm,
  onSubmit,
}: BankInfoScreenProps) => {
  const moneyPositions = useMemo(() => generateRandomPositions(15), []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="min-h-screen flex items-center justify-center p-4 sm:p-8 relative"
    >
      {/* Floating money icons */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {moneyPositions.map((pos, i) => (
          <motion.div
            key={i}
            className="absolute text-2xl sm:text-4xl opacity-20"
            style={{
              left: `${pos.left}%`,
              top: `${pos.top}%`,
            }}
            animate={{
              y: [0, -30, 0],
              rotate: [0, 360],
            }}
            transition={{
              duration: pos.duration,
              repeat: Infinity,
              delay: pos.delay,
            }}
          >
            💰
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ scale: 0.8, rotateY: 90 }}
        animate={{ scale: 1, rotateY: 0 }}
        transition={{ type: "spring", stiffness: 200 }}
        className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl p-6 sm:p-8 max-w-md w-full relative z-10 border-2 sm:border-4 border-yellow-400"
      >
        <div className="text-center mb-6 sm:mb-8">
          <motion.div
            animate={{
              rotate: [0, 10, -10, 10, 0],
              scale: [1, 1.1, 1, 1.1, 1],
            }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-5xl sm:text-6xl lg:text-7xl mb-3 sm:mb-4"
          >
            💰
          </motion.div>
          <h2 className="text-2xl sm:text-3xl font-bold text-tet-red-700 mb-2 sm:mb-3 px-4">
            Chúc mừng! Bạn đã nhận được
          </h2>
          <motion.p
            animate={{
              scale: [1, 1.05, 1],
            }}
            transition={{ duration: 1, repeat: Infinity }}
            className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-yellow-500 via-yellow-600 to-yellow-500 bg-clip-text text-transparent pb-1"
          >
            {wonAmount.toLocaleString("vi-VN")} đ
          </motion.p>
          <p className="text-gray-600 text-sm sm:text-base mt-2 sm:mt-3 px-4">
            Vui lòng nhập thông tin để nhận lì xì 🏦
          </p>
        </div>

        <form onSubmit={onSubmit} className="space-y-6">
          <div>
            <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
              🏦 Tên ngân hàng
            </label>
            <input
              type="text"
              value={bankForm.bankName}
              onChange={(e) =>
                setBankForm({ ...bankForm, bankName: e.target.value })
              }
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none transition-all"
              placeholder="Vietcombank, Techcombank, ..."
              required
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
              💳 Số tài khoản
            </label>
            <input
              type="text"
              value={bankForm.accountNumber}
              onChange={(e) =>
                setBankForm({ ...bankForm, accountNumber: e.target.value })
              }
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none transition-all"
              placeholder="Nhập số tài khoản"
              required
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
              👤 Tên chủ tài khoản
            </label>
            <input
              type="text"
              value={bankForm.accountName}
              onChange={(e) =>
                setBankForm({ ...bankForm, accountName: e.target.value })
              }
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none transition-all"
              placeholder="NGUYEN VAN A"
            />
          </div>

          <motion.button
            whileHover={{
              scale: 1.02,
              boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
            }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="w-full bg-gradient-to-r from-red-600 via-red-500 to-yellow-500 text-white font-bold text-lg py-4 rounded-xl shadow-lg relative overflow-hidden group"
          >
            <span className="relative z-10">✉️ Gửi thông tin cho Admin</span>
            <motion.div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-red-400 opacity-0 group-hover:opacity-100 transition-opacity" />
          </motion.button>
        </form>

        {/* Decorative corner elements */}
        <div className="absolute top-2 left-2 text-3xl">🎋</div>
        <div className="absolute top-2 right-2 text-3xl">🎋</div>
        <div className="absolute bottom-2 left-2 text-3xl">🧧</div>
        <div className="absolute bottom-2 right-2 text-3xl">🧧</div>
      </motion.div>
    </motion.div>
  );
};
