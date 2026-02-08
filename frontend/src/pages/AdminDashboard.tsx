import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { useAuth } from "../hooks/useAuth";
import { adminAPI } from "../services/api";
import { UserTable } from "../components/admin/UserTable";
import { UserModal } from "../components/admin/UserModal";
import { CustomSelect } from "../components/shared/CustomSelect";
import { FloatingLanterns } from "../components/shared/FloatingLanterns";
import { FallingBlossoms } from "../components/shared/FallingBlossoms";
import { generateRandomPositions } from "../utils/randomPositions";

interface User {
  _id: string;
  username: string;
  name?: string;
  role: string;
  luckyMoneyStatus: string;
  wonAmount: number;
  bankInfo: {
    bankName: string;
    accountNumber: string;
    accountName?: string;
  } | null;
  availableAmounts: number[];
  customGreeting?: string;
  isTransferred?: boolean;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

const ITEMS_PER_PAGE = 10;

const AdminDashboard = () => {
  const { logout, user: currentUser } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [filterRole, setFilterRole] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const searchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const luckyWordPositions = useMemo(() => generateRandomPositions(8), []);

  // Form state
  const [formData, setFormData] = useState({
    username: "",
    name: "",
    password: "",
    role: "FRIEND",
    availableAmounts: "",
    customGreeting: "",
  });

  const fetchUsers = useCallback(
    async (page = 1, search?: string, role?: string, status?: string) => {
      try {
        setLoading(true);
        const response = await adminAPI.getUsers({
          page,
          limit: ITEMS_PER_PAGE,
          search: search || undefined,
          role: role || undefined,
          status: status || undefined,
        });
        setUsers(response.data.users);
        setPagination(response.data.pagination);
        setCurrentPage(page);
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
    },
    [logout],
  );

  // Reload with current filters
  const reloadUsers = useCallback(
    (page?: number) => {
      return fetchUsers(
        page ?? currentPage,
        debouncedSearch,
        filterRole,
        filterStatus,
      );
    },
    [fetchUsers, currentPage, debouncedSearch, filterRole, filterStatus],
  );

  // Initial load
  useEffect(() => {
    fetchUsers(1);
  }, [fetchUsers]);

  // Debounce search input
  useEffect(() => {
    if (searchTimerRef.current) {
      clearTimeout(searchTimerRef.current);
    }
    searchTimerRef.current = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 400);
    return () => {
      if (searchTimerRef.current) {
        clearTimeout(searchTimerRef.current);
      }
    };
  }, [searchQuery]);

  // Re-fetch when filters change, reset to page 1
  useEffect(() => {
    setCurrentPage(1);
    fetchUsers(1, debouncedSearch, filterRole, filterStatus);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch, filterRole, filterStatus]);

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
        name: formData.name || undefined,
        customGreeting: formData.customGreeting || undefined,
      });
      await reloadUsers();
      handleCloseModal();
      toast.success(`Đã tạo người dùng ${formData.username}`);
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
        name?: string;
        customGreeting?: string;
      } = {
        availableAmounts: amounts,
        role: formData.role,
        name: formData.name || undefined,
        customGreeting: formData.customGreeting || undefined,
      };
      if (formData.password) {
        updateData.password = formData.password;
      }

      await adminAPI.updateUser(editingUser._id, updateData);
      await reloadUsers();
      handleCloseModal();
      toast.success(`Đã cập nhật người dùng ${editingUser.username}`);
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
      await reloadUsers();
      toast.success("Đã xóa người dùng");
    } catch (err) {
      const errorMessage =
        err instanceof Error && "response" in err
          ? (err as { response?: { data?: { message?: string } } }).response
              ?.data?.message
          : undefined;
      toast.error(errorMessage || "Xóa người dùng thất bại");
    }
  };

  const handleResetUser = async (userId: string) => {
    try {
      await adminAPI.resetUser(userId);
      await reloadUsers();
      toast.success("Đã reset trạng thái người dùng");
    } catch (err) {
      const errorMessage =
        err instanceof Error && "response" in err
          ? (err as { response?: { data?: { message?: string } } }).response
              ?.data?.message
          : undefined;
      toast.error(errorMessage || "Reset thất bại");
    }
  };

  const handleToggleTransferred = async (userId: string) => {
    // Optimistic update
    setUsers((prev) =>
      prev.map((u) =>
        u._id === userId ? { ...u, isTransferred: !u.isTransferred } : u,
      ),
    );
    try {
      await adminAPI.toggleTransferred(userId);
    } catch (err) {
      // Revert on error
      setUsers((prev) =>
        prev.map((u) =>
          u._id === userId ? { ...u, isTransferred: !u.isTransferred } : u,
        ),
      );
      const errorMessage =
        err instanceof Error && "response" in err
          ? (err as { response?: { data?: { message?: string } } }).response
              ?.data?.message
          : undefined;
      toast.error(errorMessage || "Cập nhật thất bại");
    }
  };


  const handleOpenModal = (user?: User) => {
    if (user) {
      setEditingUser(user);
      setFormData({
        username: user.username,
        name: user.name || "",
        password: "",
        role: user.role,
        availableAmounts: user.availableAmounts?.join(", ") || "",
        customGreeting: user.customGreeting || "",
      });
    } else {
      setEditingUser(null);
      setFormData({
        username: "",
        name: "",
        password: "",
        role: "FRIEND",
        availableAmounts: "",
        customGreeting: "",
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingUser(null);
    setFormData({
      username: "",
      name: "",
      password: "",
      role: "FRIEND",
      availableAmounts: "",
      customGreeting: "",
    });
  };

  const handleFormChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-800 via-red-900 to-black p-6 relative overflow-hidden">
      {/* Background decorations */}
      <FloatingLanterns />
      <FallingBlossoms />

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
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-yellow-200 via-yellow-400 to-yellow-200 bg-clip-text text-transparent mb-2 pb-1">
                🏮 Quản Lý Lì Xì Tết
              </h1>
              <p className="text-yellow-100/80 text-base sm:text-lg">
                Chào mừng,{" "}
                <span className="font-semibold text-yellow-300">
                  {currentUser?.name || currentUser?.username}
                </span>
                ! 🧧
              </p>
            </div>
            <div className="flex gap-2 sm:gap-3 flex-wrap">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleOpenModal()}
                className="flex-1 sm:flex-none bg-gradient-to-r from-yellow-400 to-yellow-500 text-red-900 px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-bold hover:from-yellow-300 hover:to-yellow-400 transition-all shadow-lg border-2 border-yellow-600/50 text-sm sm:text-base"
              >
                <span className="hidden sm:inline">➕ Tạo người dùng</span>
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
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-8">
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-br from-blue-600/30 to-blue-700/30 backdrop-blur-md rounded-2xl p-4 sm:p-6 border-2 border-blue-400/30 shadow-xl"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-200 text-xs sm:text-sm font-semibold">
                  Tổng người dùng
                </p>
                <p className="text-3xl sm:text-4xl font-bold text-white mt-1 sm:mt-2">
                  {pagination?.total || users.length}
                </p>
              </div>
              <div className="text-3xl sm:text-5xl">👥</div>
            </div>
          </motion.div>

          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-green-600/30 to-green-700/30 backdrop-blur-md rounded-2xl p-4 sm:p-6 border-2 border-green-400/30 shadow-xl"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-200 text-xs sm:text-sm font-semibold">
                  Đã chơi
                </p>
                <p className="text-3xl sm:text-4xl font-bold text-white mt-1 sm:mt-2">
                  {users.filter((u) => u.luckyMoneyStatus === "PLAYED").length}
                </p>
              </div>
              <div className="text-3xl sm:text-5xl">✅</div>
            </div>
          </motion.div>

          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-br from-yellow-600/30 to-yellow-700/30 backdrop-blur-md rounded-2xl p-4 sm:p-6 border-2 border-yellow-400/30 shadow-xl"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-200 text-xs sm:text-sm font-semibold">
                  Tổng tiền phát
                </p>
                <p className="text-2xl sm:text-4xl font-bold text-white mt-1 sm:mt-2">
                  {users
                    .reduce((sum, u) => sum + (u.wonAmount || 0), 0)
                    .toLocaleString("vi-VN")}{" "}
                  đ
                </p>
              </div>
              <div className="text-3xl sm:text-5xl">💰</div>
            </div>
          </motion.div>

          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="bg-gradient-to-br from-purple-600/30 to-purple-700/30 backdrop-blur-md rounded-2xl p-4 sm:p-6 border-2 border-purple-400/30 shadow-xl"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-200 text-xs sm:text-sm font-semibold">
                  Đã chuyển
                </p>
                <p className="text-3xl sm:text-4xl font-bold text-white mt-1 sm:mt-2">
                  {users.filter((u) => u.isTransferred).length}
                </p>
              </div>
              <div className="text-3xl sm:text-5xl">💸</div>
            </div>
          </motion.div>
        </div>

        {/* Search & Filter Bar */}
        <motion.div
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mb-6 bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-yellow-400/20 shadow-lg"
        >
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="🔍 Tìm theo tên hoặc tên đăng nhập..."
                className="w-full px-4 py-2.5 rounded-xl bg-white/10 border border-yellow-400/30 focus:border-yellow-400 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 transition-all text-sm"
              />
            </div>
            <CustomSelect
              value={filterRole}
              onChange={setFilterRole}
              options={[
                { value: "", label: "Tất cả vai trò" },
                { value: "LOVER", label: "Người yêu" },
                { value: "FRIEND", label: "Bạn bè" },
                { value: "COLLEAGUE", label: "Đồng nghiệp" },
                { value: "FAMILY", label: "Gia đình" },
              ]}
            />
            <CustomSelect
              value={filterStatus}
              onChange={setFilterStatus}
              options={[
                { value: "", label: "Tất cả trạng thái" },
                { value: "PLAYED", label: "Đã chơi" },
                { value: "NOT_PLAYED", label: "Chưa chơi" },
                { value: "TRANSFERRED", label: "Đã chuyển khoản" },
                { value: "NOT_TRANSFERRED", label: "Chưa chuyển khoản" },
              ]}
            />
          </div>
        </motion.div>

        {/* User Table */}
        {loading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-yellow-400/20 animate-pulse"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-white/20 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-white/20 rounded w-1/3" />
                    <div className="h-3 bg-white/10 rounded w-1/4" />
                  </div>
                  <div className="h-6 bg-white/20 rounded-full w-20" />
                  <div className="h-6 bg-white/10 rounded w-24" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            <UserTable
              users={users}
              onEdit={handleOpenModal}
              onDelete={handleDeleteUser}
              onReset={handleResetUser}
              onToggleTransferred={handleToggleTransferred}
            />

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-6 flex justify-center items-center gap-2"
              >
                <button
                  onClick={() => reloadUsers(currentPage - 1)}
                  disabled={currentPage <= 1}
                  className="px-4 py-2 rounded-lg bg-white/10 text-white border border-yellow-400/30 disabled:opacity-30 hover:bg-white/20 transition-all text-sm font-semibold"
                >
                  ← Trước
                </button>

                {Array.from(
                  { length: pagination.totalPages },
                  (_, i) => i + 1,
                ).map((page) => (
                  <button
                    key={page}
                    onClick={() => reloadUsers(page)}
                    className={`w-10 h-10 rounded-lg font-bold text-sm transition-all ${
                      page === currentPage
                        ? "bg-yellow-400 text-red-900 shadow-lg"
                        : "bg-white/10 text-white border border-yellow-400/30 hover:bg-white/20"
                    }`}
                  >
                    {page}
                  </button>
                ))}

                <button
                  onClick={() => reloadUsers(currentPage + 1)}
                  disabled={currentPage >= pagination.totalPages}
                  className="px-4 py-2 rounded-lg bg-white/10 text-white border border-yellow-400/30 disabled:opacity-30 hover:bg-white/20 transition-all text-sm font-semibold"
                >
                  Sau →
                </button>

                <span className="text-yellow-200/70 text-sm ml-2">
                  {pagination.total} người dùng
                </span>
              </motion.div>
            )}
          </>
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
