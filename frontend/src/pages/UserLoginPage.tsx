import { useState, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../hooks/useAuth";
import { authAPI } from "../services/api";
import { FloatingLanterns } from "../components/shared/FloatingLanterns";
import { FallingBlossoms } from "../components/shared/FallingBlossoms";
import { generateRandomPositions } from "../utils/randomPositions";

const UserLoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const envelopePositions = useMemo(() => generateRandomPositions(8), []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await authAPI.userLogin({ username, password });
      const { access_token, user } = response.data;

      login(access_token, user);

      setTimeout(() => {
        navigate("/lucky-money", { replace: true });
      }, 100);
    } catch (err) {
      const errorMessage =
        err instanceof Error && "response" in err
          ? (err as { response?: { data?: { message?: string } } }).response
              ?.data?.message
          : undefined;
      setError(
        errorMessage || "Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin."
      );
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-600 via-red-600 to-yellow-500 p-4 relative overflow-hidden">
      <FloatingLanterns />

      {/* Decorative elements */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Floating money */}
        {envelopePositions.map((pos, i) => (
          <motion.div
            key={i}
            className="absolute text-4xl"
            style={{
              left: `${pos.left}%`,
              top: `${pos.top}%`,
            }}
            animate={{
              y: [0, -30, 0],
              rotate: [0, 360],
              opacity: [0.3, 0.7, 0.3],
            }}
            transition={{
              duration: pos.duration,
              repeat: Infinity,
              delay: pos.delay,
            }}
          >
            {["🧧", "💰", "🎁", "🏮"][i % 4]}
          </motion.div>
        ))}

        <motion.div
          className="absolute top-10 right-20 text-9xl text-yellow-300/30 font-bold"
          animate={{
            rotate: [0, 10, -10, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{ duration: 5, repeat: Infinity }}
        >
          財
        </motion.div>
        <motion.div
          className="absolute top-20 left-10 text-8xl text-yellow-300/20 font-bold"
          animate={{ rotate: [0, 5, -5, 0] }}
          transition={{ duration: 4, repeat: Infinity }}
        >
          福
        </motion.div>
        <motion.div
          className="absolute bottom-20 left-16 text-7xl text-yellow-300/15 font-bold"
          animate={{ rotate: [0, -3, 3, 0], scale: [1, 1.05, 1] }}
          transition={{ duration: 5, repeat: Infinity, delay: 2 }}
        >
          禄
        </motion.div>
        <motion.div
          className="absolute bottom-24 right-10 text-8xl text-yellow-300/20 font-bold"
          animate={{ rotate: [0, -5, 5, 0] }}
          transition={{ duration: 4, repeat: Infinity, delay: 1 }}
        >
          春
        </motion.div>
        <motion.div
          className="absolute top-1/2 right-8 text-7xl text-yellow-300/15 font-bold"
          animate={{ rotate: [0, 3, -3, 0], scale: [1, 1.08, 1] }}
          transition={{ duration: 6, repeat: Infinity, delay: 1.5 }}
        >
          喜
        </motion.div>
      </div>

      <FallingBlossoms />

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md z-10"
      >
        <div className="bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl p-8 border-4 border-yellow-400 relative">
          {/* Header */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0, y: -50 }}
              animate={{ scale: 1, y: 0 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 150 }}
              className="relative inline-block"
            >
              <motion.div
                animate={{
                  y: [0, -10, 0],
                  rotate: [0, 5, -5, 0],
                }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-8xl"
              >
                🧧
              </motion.div>

              {/* Sparkles around envelope */}
              {[0, 1, 2, 3].map((i) => (
                <motion.div
                  key={i}
                  className="absolute text-2xl"
                  style={{
                    top: "50%",
                    left: "50%",
                  }}
                  animate={{
                    x: [0, Math.cos((i * 90 * Math.PI) / 180) * 50],
                    y: [0, Math.sin((i * 90 * Math.PI) / 180) * 50],
                    scale: [0, 1, 0],
                    rotate: [0, 360],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: i * 0.5,
                  }}
                >
                  ✨
                </motion.div>
              ))}
            </motion.div>

            <motion.h1
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-4xl font-bold bg-gradient-to-r from-red-600 via-pink-600 to-yellow-500 bg-clip-text text-transparent mb-2 pb-1"
            >
              Nhận Lì Xì Tết
            </motion.h1>
            <p className="text-gray-600 font-semibold">
              Chúc Mừng Năm Mới 2026 🎊
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm font-semibold"
              >
                ❌ {error}
              </motion.div>
            )}

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
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none transition-all"
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
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none transition-all"
                placeholder="Nhập mật khẩu"
                required
              />
            </div>

            <motion.button
              whileHover={{
                scale: 1.02,
                boxShadow: "0 15px 40px rgba(236,72,153,0.4)",
              }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-pink-500 via-red-500 to-yellow-400 text-white font-bold text-lg py-4 rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group"
            >
              <span className="relative z-10">
                {loading ? "⏳ Đang đăng nhập..." : "🎁 Đăng nhập nhận lì xì"}
              </span>
              <motion.div className="absolute inset-0 bg-gradient-to-r from-yellow-300 to-pink-300 opacity-0 group-hover:opacity-100 transition-opacity" />
            </motion.button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-gray-600 text-sm">
              Bạn là quản trị viên?{" "}
              <Link
                to="/admin/login"
                className="text-red-600 hover:text-red-700 font-semibold underline"
              >
                Đăng nhập Admin 🔑
              </Link>
            </p>
          </div>

          {/* Decorative corners */}
          <div className="absolute top-2 left-2 text-2xl">🏮</div>
          <div className="absolute top-2 right-2 text-2xl">🏮</div>
          <div className="absolute bottom-2 left-2 text-2xl">🎋</div>
          <div className="absolute bottom-2 right-2 text-2xl">🎋</div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-6 text-center"
        >
          <p className="text-white font-bold text-lg drop-shadow-lg">
            ✨ Năm Mới Vạn Sự Như Ý - Tài Lộc Dồi Dào! ✨
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default UserLoginPage;
