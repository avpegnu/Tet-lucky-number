import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../hooks/useAuth";
import { authAPI } from "../services/api";
import { FloatingLanterns } from "../components/shared/FloatingLanterns";
import { generateRandomPositions } from "../utils/randomPositions";

const AdminRegisterPage = () => {
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const lanternPositions = useMemo(() => generateRandomPositions(6), []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Mật khẩu xác nhận không khớp.");
      return;
    }

    if (password.length < 6) {
      setError("Mật khẩu phải có ít nhất 6 ký tự.");
      return;
    }

    setLoading(true);

    try {
      const response = await authAPI.adminRegister({
        username,
        password,
        name: name || undefined,
      });
      const { access_token, user } = response.data;

      login(access_token, user);

      setTimeout(() => {
        navigate("/admin/dashboard", { replace: true });
      }, 100);
    } catch (err) {
      const errorMessage =
        err instanceof Error && "response" in err
          ? (err as { response?: { data?: { message?: string } } }).response
              ?.data?.message
          : undefined;
      setError(
        errorMessage || "Đăng ký thất bại. Vui lòng thử lại."
      );
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-700 via-red-800 to-red-900 p-4 relative overflow-hidden">
      <FloatingLanterns />

      {/* Decorative elements */}
      <div className="absolute inset-0 pointer-events-none">
        {lanternPositions.map((pos, i) => (
          <motion.div
            key={i}
            className="absolute text-5xl"
            style={{
              left: `${pos.left}%`,
              top: `${pos.top}%`,
            }}
            animate={{
              scale: [0, 1.5, 0],
              rotate: [0, 180, 360],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: pos.delay,
            }}
          >
            ✨
          </motion.div>
        ))}

        <motion.div
          className="absolute top-20 left-10 text-8xl text-yellow-400/20 font-bold"
          animate={{ rotate: [0, 5, -5, 0] }}
          transition={{ duration: 4, repeat: Infinity }}
        >
          福
        </motion.div>
        <motion.div
          className="absolute bottom-20 right-10 text-8xl text-yellow-400/20 font-bold"
          animate={{ rotate: [0, -5, 5, 0] }}
          transition={{ duration: 4, repeat: Infinity, delay: 1 }}
        >
          春
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md z-10"
      >
        <div className="bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl p-8 border-4 border-yellow-400 relative">
          {/* Header */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="text-7xl mb-4"
            >
              🏮
            </motion.div>
            <motion.h1
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3 }}
              className="text-4xl font-bold bg-gradient-to-r from-red-600 to-yellow-600 bg-clip-text text-transparent mb-2 pb-1"
            >
              Đăng Ký Admin
            </motion.h1>
            <p className="text-gray-600 font-semibold">
              Tạo tài khoản quản lý Lì Xì Tết 🧧
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm font-semibold"
              >
                ❌ {error}
              </motion.div>
            )}

            <div>
              <label
                htmlFor="name"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                📛 Tên hiển thị
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none transition-all"
                placeholder="Nhập tên của bạn"
              />
            </div>

            <div>
              <label
                htmlFor="username"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                👤 Tên đăng nhập
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none transition-all"
                placeholder="Nhập tên đăng nhập"
                required
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                🔐 Mật khẩu
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none transition-all"
                placeholder="Nhập mật khẩu (tối thiểu 6 ký tự)"
                required
              />
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                🔐 Xác nhận mật khẩu
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none transition-all"
                placeholder="Nhập lại mật khẩu"
                required
              />
            </div>

            <motion.button
              whileHover={{
                scale: 1.02,
                boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
              }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-red-600 via-red-500 to-yellow-500 text-white font-bold text-lg py-4 rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group"
            >
              <span className="relative z-10">
                {loading ? "⏳ Đang đăng ký..." : "🚀 Đăng ký"}
              </span>
              <motion.div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-red-400 opacity-0 group-hover:opacity-100 transition-opacity" />
            </motion.button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-gray-600 text-sm">
              Đã có tài khoản?{" "}
              <a
                href="/admin/login"
                className="text-red-600 hover:text-red-700 font-semibold underline"
              >
                Đăng nhập tại đây 🏮
              </a>
            </p>
          </div>

          {/* Decorative corners */}
          <div className="absolute top-2 left-2 text-2xl">🎋</div>
          <div className="absolute top-2 right-2 text-2xl">🎋</div>
          <div className="absolute bottom-2 left-2 text-2xl">🧧</div>
          <div className="absolute bottom-2 right-2 text-2xl">🧧</div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-6 text-center"
        >
          <p className="text-yellow-300 font-bold text-lg drop-shadow-lg">
            🎊 Chúc Mừng Năm Mới - An Khang Thịnh Vượng! 🎊
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default AdminRegisterPage;
