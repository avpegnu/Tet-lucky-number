import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { useAuth } from "../hooks/useAuth";
import { adminAPI } from "../services/api";
import { UserTable } from "../components/admin/UserTable";
import { UserModal } from "../components/admin/UserModal";
import { FloatingLanterns } from "../components/shared/FloatingLanterns";
import { generateRandomPositions } from "../utils/randomPositions";

interface User {
  _id: string;
  username: string;
  role: string;
  luckyMoneyStatus: string;
  wonAmount: number;
  bankInfo: { bankName: string; accountNumber: string } | null;
  availableAmounts: number[];
}

const AdminDashboard = () => {
  const { logout, user: currentUser } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const luckyWordPositions = useMemo(() => generateRandomPositions(8), []);

  // Form state
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    role: "FRIEND",
    availableAmounts: "",
  });

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getUsers();
      setUsers(response.data);
    } catch (err) {
      console.error("Failed to fetch users:", err);
      if (err instanceof Error && "response" in err) {
        const error = err as { response?: { status?: number } };
        if (error.response?.status === 401) {
          toast.error("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.");
          logout();
          return;
        }
      }
      toast.error("Không thể tải danh sách người dùng. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();

    const amounts = formData.availableAmounts
      .split(",")
      .map((a) => parseInt(a.trim()))
      .filter((a) => !isNaN(a));

    try {
      await adminAPI.createUser({
        username: formData.username,
        password: formData.password,
        role: formData.role,
        availableAmounts: amounts,
      });
      await fetchUsers();
      handleCloseModal();
      toast.success(`✅ Đã tạo người dùng ${formData.username}`);
    } catch (err) {
      const errorMessage =
        err instanceof Error && "response" in err
          ? (err as { response?: { data?: { message?: string } } }).response
              ?.data?.message
          : undefined;
      toast.error(errorMessage || "Tạo người dùng thất bại");
    }
  };

  const handleEditUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    const amounts = formData.availableAmounts
      .split(",")
      .map((a) => parseInt(a.trim()))
      .filter((a) => !isNaN(a));

    try {
      const updateData: {
        availableAmounts: number[];
        password?: string;
        role?: string;
      } = {
        availableAmounts: amounts,
        role: formData.role,
      };
      if (formData.password) {
        updateData.password = formData.password;
      }

      await adminAPI.updateUser(editingUser._id, updateData);
      await fetchUsers();
      handleCloseModal();
      toast.success(`💾 Đã cập nhật người dùng ${editingUser.username}`);
    } catch (err) {
      const errorMessage =
        err instanceof Error && "response" in err
          ? (err as { response?: { data?: { message?: string } } }).response
              ?.data?.message
          : undefined;
      toast.error(errorMessage || "Cập nhật người dùng thất bại");
    }
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      await adminAPI.deleteUser(userId);
      await fetchUsers();
      toast.success("🗑️ Đã xóa người dùng");
    } catch (err) {
      const errorMessage =
        err instanceof Error && "response" in err
          ? (err as { response?: { data?: { message?: string } } }).response
              ?.data?.message
          : undefined;
      toast.error(errorMessage || "Xóa người dùng thất bại");
    }
  };

  const handleOpenModal = (user?: User) => {
    if (user) {
      setEditingUser(user);
      setFormData({
        username: user.username,
        password: "",
        role: user.role,
        availableAmounts: user.availableAmounts?.join(", ") || "",
      });
    } else {
      setEditingUser(null);
      setFormData({
        username: "",
        password: "",
        role: "FRIEND",
        availableAmounts: "",
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingUser(null);
    setFormData({
      username: "",
      password: "",
      role: "FRIEND",
      availableAmounts: "",
    });
  };

  const handleFormChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-800 via-red-900 to-black p-6 relative overflow-hidden">
      {/* Background decorations */}
      <FloatingLanterns />

      {/* Floating lucky words */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {luckyWordPositions.map((pos, i) => {
          const words = ["福", "禄", "寿", "喜", "财", "運", "安", "康"];
          return (
            <motion.div
              key={i}
              className="absolute text-6xl font-bold text-yellow-400/10"
              style={{
                left: `${pos.left}%`,
                top: `${pos.top}%`,
              }}
              animate={{
                rotate: [0, 360],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: pos.duration + 5,
                repeat: Infinity,
                ease: "linear",
              }}
            >
              {words[i % words.length]}
            </motion.div>
          );
        })}
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="mb-8 bg-gradient-to-r from-red-700/50 to-red-800/50 backdrop-blur-md rounded-2xl p-4 sm:p-6 border-2 border-yellow-400/30 shadow-2xl"
        >
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-yellow-200 via-yellow-400 to-yellow-200 bg-clip-text text-transparent mb-2">
                🏮 Admin Dashboard - Quản Lý Lì Xì Tết
              </h1>
              <p className="text-yellow-100/80 text-base sm:text-lg">
                Chào mừng,{" "}
                <span className="font-semibold text-yellow-300">
                  {currentUser?.username}
                </span>
                ! 🧧
              </p>
            </div>
            <div className="flex gap-2 sm:gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleOpenModal()}
                className="flex-1 sm:flex-none bg-gradient-to-r from-yellow-400 to-yellow-500 text-red-900 px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-bold hover:from-yellow-300 hover:to-yellow-400 transition-all shadow-lg border-2 border-yellow-600/50 text-sm sm:text-base"
              >
                <span className="hidden sm:inline">➕ Tạo người dùng mới</span>
                <span className="sm:hidden">➕ Tạo mới</span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={logout}
                className="flex-1 sm:flex-none bg-red-600/70 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-bold hover:bg-red-500/70 transition-all border-2 border-red-400/30 shadow-lg text-sm sm:text-base"
              >
                <span className="hidden sm:inline">🚪 Đăng xuất</span>
                <span className="sm:hidden">🚪 Thoát</span>
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-br from-blue-600/30 to-blue-700/30 backdrop-blur-md rounded-2xl p-6 border-2 border-blue-400/30 shadow-xl"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-200 text-sm font-semibold">
                  Tổng người dùng
                </p>
                <p className="text-4xl font-bold text-white mt-2">
                  {users.length}
                </p>
              </div>
              <div className="text-5xl">👥</div>
            </div>
          </motion.div>

          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-green-600/30 to-green-700/30 backdrop-blur-md rounded-2xl p-6 border-2 border-green-400/30 shadow-xl"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-200 text-sm font-semibold">Đã chơi</p>
                <p className="text-4xl font-bold text-white mt-2">
                  {users.filter((u) => u.luckyMoneyStatus === "PLAYED").length}
                </p>
              </div>
              <div className="text-5xl">✅</div>
            </div>
          </motion.div>

          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-br from-yellow-600/30 to-yellow-700/30 backdrop-blur-md rounded-2xl p-6 border-2 border-yellow-400/30 shadow-xl"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-200 text-sm font-semibold">
                  Tổng tiền đã phát
                </p>
                <p className="text-4xl font-bold text-white mt-2">
                  {users
                    .reduce((sum, u) => sum + (u.wonAmount || 0), 0)
                    .toLocaleString("vi-VN")}{" "}
                  đ
                </p>
              </div>
              <div className="text-5xl">💰</div>
            </div>
          </motion.div>
        </div>

        {/* User Table */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="text-6xl"
            >
              🏮
            </motion.div>
          </div>
        ) : (
          <UserTable
            users={users}
            onEdit={handleOpenModal}
            onDelete={handleDeleteUser}
          />
        )}
      </div>

      {/* Modal */}
      <UserModal
        showModal={showModal}
        editingUser={editingUser}
        formData={formData}
        onClose={handleCloseModal}
        onSubmit={editingUser ? handleEditUser : handleCreateUser}
        onChange={handleFormChange}
      />
    </div>
  );
};

export default AdminDashboard;
