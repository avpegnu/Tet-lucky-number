import { motion, AnimatePresence } from "framer-motion";
import type { FormEvent } from "react";

interface FormData {
  username: string;
  password: string;
  role: string;
  availableAmounts: string;
}

interface UserModalProps {
  showModal: boolean;
  editingUser: { _id: string; username: string } | null;
  formData: FormData;
  onClose: () => void;
  onSubmit: (e: FormEvent) => void;
  onChange: (field: keyof FormData, value: string) => void;
}

export const UserModal = ({
  showModal,
  editingUser,
  formData,
  onClose,
  onSubmit,
  onChange,
}: UserModalProps) => (
  <AnimatePresence>
    {showModal && (
      <>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40"
          onClick={onClose}
        />
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="bg-gradient-to-br from-red-700 via-red-800 to-red-900 rounded-3xl shadow-2xl p-8 max-w-md w-full border-4 border-yellow-400/30 relative overflow-hidden"
          >
            {/* Decorative elements */}
            <div className="absolute top-2 right-2 text-3xl">🧧</div>
            <div className="absolute bottom-2 left-2 text-3xl">🏮</div>

            <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-yellow-200 to-yellow-400 bg-clip-text text-transparent">
              {editingUser ? "✏️ Sửa người dùng" : "➕ Tạo người dùng mới"}
            </h2>
            <form onSubmit={onSubmit} className="space-y-4">
              <div>
                <label className="block text-yellow-100 mb-2 font-semibold">
                  Username
                </label>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => onChange("username", e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-white/10 border-2 border-yellow-400/30 focus:border-yellow-400 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 transition-all"
                  required
                  disabled={!!editingUser}
                  placeholder="Nhập username..."
                />
              </div>

              <div>
                <label className="block text-yellow-100 mb-2 font-semibold">
                  {editingUser
                    ? "Mật khẩu mới (để trống nếu không đổi)"
                    : "Mật khẩu"}
                </label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => onChange("password", e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-white/10 border-2 border-yellow-400/30 focus:border-yellow-400 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 transition-all"
                  required={!editingUser}
                  placeholder={
                    editingUser
                      ? "Nhập password mới (tùy chọn)..."
                      : "Nhập password..."
                  }
                />
              </div>

              <div>
                <label className="block text-yellow-100 mb-2 font-semibold">
                  Vai trò
                </label>
                <select
                  value={formData.role}
                  onChange={(e) => onChange("role", e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-white/10 border-2 border-yellow-400/30 focus:border-yellow-400 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400/50 transition-all"
                >
                  <option value="FRIEND" className="bg-red-800">
                    FRIEND
                  </option>
                  <option value="LOVER" className="bg-red-800">
                    LOVER
                  </option>
                  <option value="COLLEAGUE" className="bg-red-800">
                    COLLEAGUE
                  </option>
                </select>
              </div>

              <div>
                <label className="block text-yellow-100 mb-2 font-semibold">
                  Lì xì có sẵn (phân cách bởi dấu phẩy)
                </label>
                <input
                  type="text"
                  value={formData.availableAmounts}
                  onChange={(e) => onChange("availableAmounts", e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-white/10 border-2 border-yellow-400/30 focus:border-yellow-400 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 transition-all"
                  placeholder="Vd: 50000, 100000, 200000"
                />
                <p className="text-xs text-gray-300 mt-1">
                  💡 Nhập các số tiền lì xì, cách nhau bằng dấu phẩy
                </p>
              </div>

              <div className="flex gap-3 mt-6">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-yellow-400 to-yellow-500 text-red-900 px-6 py-3 rounded-lg font-bold hover:from-yellow-300 hover:to-yellow-400 transition-all shadow-lg"
                >
                  {editingUser ? "💾 Cập nhật" : "✅ Tạo mới"}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="button"
                  onClick={onClose}
                  className="flex-1 bg-gray-600/50 text-white px-6 py-3 rounded-lg font-bold hover:bg-gray-500/50 transition-all border border-gray-400/30"
                >
                  ❌ Hủy
                </motion.button>
              </div>
            </form>
          </motion.div>
        </div>
      </>
    )}
  </AnimatePresence>
);
