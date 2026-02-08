import { motion, AnimatePresence } from "framer-motion";
import type { FormEvent } from "react";
import { CustomSelect } from "../shared/CustomSelect";

interface FormData {
  username: string;
  name: string;
  password: string;
  role: string;
  availableAmounts: string;
  customGreeting: string;
}

const defaultGreetings: Record<string, string> = {
  LOVER:
    "💝 Chúc em một năm mới tràn ngập yêu thương và hạnh phúc! Nhận lì xì từ anh nhé! 💕",
  FRIEND:
    "🎉 Chúc mừng năm mới! Năm nay giàu to, vui vẻ hết nấc! 🥳 Nhận lì xì đi bạn êi!",
  COLLEAGUE:
    "🏮 Kính chúc quý đồng nghiệp một năm mới an khang, thịnh vượng và thành công! 🌟",
  FAMILY:
    "🏡 Chúc cả gia đình một năm mới sum vầy, hạnh phúc và bình an! Nhận lì xì nè! 🧧",
};

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
            className="bg-gradient-to-br from-red-700 via-red-800 to-red-900 rounded-3xl shadow-2xl p-6 sm:p-8 max-w-md lg:max-w-2xl w-full border-4 border-yellow-400/30 relative overflow-hidden max-h-[90vh] overflow-y-auto scrollbar-hide"
          >
            {/* Close button */}
            <button
              type="button"
              onClick={onClose}
              className="absolute top-3 right-3 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-yellow-200 hover:text-white transition-all"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            <div className="absolute bottom-2 left-2 text-3xl">🏮</div>

            <h2 className="text-2xl sm:text-3xl font-bold mb-5 bg-gradient-to-r from-yellow-200 to-yellow-400 bg-clip-text text-transparent pb-1">
              {editingUser ? "✏️ Sửa người dùng" : "➕ Tạo người dùng mới"}
            </h2>
            <form onSubmit={onSubmit}>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Left column */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-yellow-100 mb-1.5 font-semibold text-sm">
                      Tên
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => onChange("name", e.target.value)}
                      className="w-full px-4 py-2.5 rounded-lg bg-white/10 border-2 border-yellow-400/30 focus:border-yellow-400 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 transition-all text-sm"
                      placeholder="Nhập tên người dùng..."
                    />
                  </div>
                  <div>
                    <label className="block text-yellow-100 mb-1.5 font-semibold text-sm">
                      Tên đăng nhập
                    </label>
                    <input
                      type="text"
                      value={formData.username}
                      onChange={(e) => onChange("username", e.target.value)}
                      className="w-full px-4 py-2.5 rounded-lg bg-white/10 border-2 border-yellow-400/30 focus:border-yellow-400 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 transition-all text-sm"
                      required
                      disabled={!!editingUser}
                      placeholder="Nhập tên đăng nhập..."
                    />
                  </div>
                  <div>
                    <label className="block text-yellow-100 mb-1.5 font-semibold text-sm">
                      {editingUser
                        ? "Mật khẩu mới (để trống nếu không đổi)"
                        : "Mật khẩu"}
                    </label>
                    <input
                      type="password"
                      value={formData.password}
                      onChange={(e) => onChange("password", e.target.value)}
                      className="w-full px-4 py-2.5 rounded-lg bg-white/10 border-2 border-yellow-400/30 focus:border-yellow-400 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 transition-all text-sm"
                      required={!editingUser}
                      placeholder={
                        editingUser
                          ? "Nhập mật khẩu mới (tùy chọn)..."
                          : "Nhập mật khẩu..."
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-yellow-100 mb-1.5 font-semibold text-sm">
                      Vai trò
                    </label>
                    <CustomSelect
                      value={formData.role}
                      onChange={(val) => onChange("role", val)}
                      options={[
                        { value: "FRIEND", label: "Bạn bè" },
                        { value: "LOVER", label: "Người yêu" },
                        { value: "COLLEAGUE", label: "Đồng nghiệp" },
                        { value: "FAMILY", label: "Gia đình" },
                      ]}
                    />
                  </div>
                </div>

                {/* Right column */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-yellow-100 mb-1.5 font-semibold text-sm">
                      Lời chúc tùy chỉnh
                    </label>
                    <textarea
                      value={formData.customGreeting}
                      onChange={(e) =>
                        onChange("customGreeting", e.target.value)
                      }
                      className="w-full px-4 py-2.5 rounded-lg bg-white/10 border-2 border-yellow-400/30 focus:border-yellow-400 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 transition-all resize-none text-sm"
                      rows={3}
                      placeholder={
                        defaultGreetings[formData.role] ||
                        "Nhập lời chúc tùy chỉnh..."
                      }
                    />
                    <p className="text-xs text-gray-300 mt-1">
                      💡 Để trống để dùng lời chúc mặc định theo vai trò
                    </p>
                  </div>
                  <div>
                    <label className="block text-yellow-100 mb-1.5 font-semibold text-sm">
                      Lì xì có sẵn (phân cách bởi dấu phẩy)
                    </label>
                    <input
                      type="text"
                      value={formData.availableAmounts}
                      onChange={(e) =>
                        onChange("availableAmounts", e.target.value)
                      }
                      className="w-full px-4 py-2.5 rounded-lg bg-white/10 border-2 border-yellow-400/30 focus:border-yellow-400 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 transition-all text-sm"
                      placeholder="Vd: 50000, 100000, 200000"
                    />
                    <p className="text-xs text-gray-300 mt-1">
                      💡 Nhập các số tiền lì xì, cách nhau bằng dấu phẩy
                    </p>
                  </div>
                </div>
              </div>

              {/* Buttons - full width below */}
              <div className="flex gap-3 mt-6">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-yellow-400 to-yellow-500 text-red-900 px-6 py-3 rounded-lg font-bold hover:from-yellow-300 hover:to-yellow-400 transition-all shadow-lg text-sm"
                >
                  {editingUser ? "💾 Cập nhật" : "✅ Tạo mới"}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="button"
                  onClick={onClose}
                  className="flex-1 bg-gray-600/50 text-white px-6 py-3 rounded-lg font-bold hover:bg-gray-500/50 transition-all border border-gray-400/30 text-sm"
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
