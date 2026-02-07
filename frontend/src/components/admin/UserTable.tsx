import { motion } from "framer-motion";
import { useState } from "react";
import { ConfirmDialog } from "../shared/ConfirmDialog";

interface User {
  _id: string;
  username: string;
  role: string;
  luckyMoneyStatus: string;
  wonAmount: number;
  bankInfo: {
    bankName: string;
    accountNumber: string;
    accountName?: string;
  } | null;
  availableAmounts: number[];
  hasDrawn?: boolean;
}

interface UserTableProps {
  users: User[];
  onEdit: (user: User) => void;
  onDelete: (userId: string) => void;
}

export const UserTable = ({ users, onEdit, onDelete }: UserTableProps) => {
  const [deleteConfirm, setDeleteConfirm] = useState<{
    isOpen: boolean;
    user: User | null;
  }>({
    isOpen: false,
    user: null,
  });

  const handleDeleteClick = (user: User) => {
    setDeleteConfirm({ isOpen: true, user });
  };

  const handleConfirmDelete = () => {
    if (deleteConfirm.user) {
      onDelete(deleteConfirm.user._id);
    }
    setDeleteConfirm({ isOpen: false, user: null });
  };

  const handleCancelDelete = () => {
    setDeleteConfirm({ isOpen: false, user: null });
  };

  return (
    <>
      {/* Desktop Table View - Hidden on mobile */}
      <div className="hidden lg:block overflow-x-auto bg-white/10 backdrop-blur-md rounded-2xl border border-yellow-400/20 shadow-2xl">
        <table className="min-w-full divide-y divide-yellow-400/20">
          <thead className="bg-gradient-to-r from-red-600/50 to-red-700/50">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-bold text-yellow-200 uppercase tracking-wider">
                Username
              </th>
              <th className="px-6 py-4 text-left text-sm font-bold text-yellow-200 uppercase tracking-wider">
                Vai trò
              </th>
              <th className="px-6 py-4 text-left text-sm font-bold text-yellow-200 uppercase tracking-wider">
                Lì xì có sẵn
              </th>
              <th className="px-6 py-4 text-left text-sm font-bold text-yellow-200 uppercase tracking-wider">
                Trạng thái
              </th>
              <th className="px-6 py-4 text-left text-sm font-bold text-yellow-200 uppercase tracking-wider">
                Số tiền trúng
              </th>
              <th className="px-6 py-4 text-left text-sm font-bold text-yellow-200 uppercase tracking-wider">
                Thông tin NH
              </th>
              <th className="px-6 py-4 text-right text-sm font-bold text-yellow-200 uppercase tracking-wider">
                Hành động
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-yellow-400/10">
            {users.map((user, index) => (
              <motion.tr
                key={user._id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="hover:bg-red-500/10 transition-all group"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-white">
                    {user.username}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      user.role === "ADMIN"
                        ? "bg-purple-500/20 text-purple-200 border border-purple-400/30"
                        : "bg-blue-500/20 text-blue-200 border border-blue-400/30"
                    }`}
                  >
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-yellow-100">
                    {user.availableAmounts && user.availableAmounts.length > 0
                      ? user.availableAmounts
                          .map((amt) => amt.toLocaleString("vi-VN"))
                          .join(", ")
                      : "Chưa có"}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      user.luckyMoneyStatus === "PLAYED"
                        ? "bg-green-500/20 text-green-200 border border-green-400/30"
                        : "bg-gray-500/20 text-gray-200 border border-gray-400/30"
                    }`}
                  >
                    {user.luckyMoneyStatus === "PLAYED"
                      ? "✅ Đã chơi"
                      : "⏳ Chưa chơi"}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-bold text-yellow-300">
                    {user.wonAmount
                      ? `${user.wonAmount.toLocaleString("vi-VN")} đ`
                      : "-"}
                  </div>
                </td>
                <td className="px-6 py-4">
                  {user.bankInfo ? (
                    <div className="text-sm text-white">
                      <div className="font-medium">
                        {user.bankInfo.bankName}
                      </div>
                      <div className="text-gray-300">
                        {user.bankInfo.accountNumber}
                      </div>
                    </div>
                  ) : (
                    <span className="text-sm text-gray-400">Chưa có</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                  <button
                    onClick={() => onEdit(user)}
                    className="text-yellow-300 hover:text-yellow-100 transition-colors font-semibold"
                  >
                    ✏️ Sửa
                  </button>
                  <button
                    onClick={() => handleDeleteClick(user)}
                    className="text-red-300 hover:text-red-100 transition-colors font-semibold"
                  >
                    🗑️ Xóa
                  </button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="lg:hidden space-y-4">
        {users.map((user, index) => (
          <motion.div
            key={user._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className="bg-white/10 backdrop-blur-md rounded-lg p-4 border border-yellow-400/30 shadow-lg"
          >
            {/* Header: Username & Role */}
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="text-lg font-bold text-yellow-200">
                  {user.username}
                </h3>
                <span
                  className={`inline-block mt-1 px-2 py-1 text-xs rounded-full font-semibold ${
                    user.role === "LOVER"
                      ? "bg-pink-500 text-white"
                      : user.role === "FRIEND"
                      ? "bg-blue-500 text-white"
                      : user.role === "FAMILY"
                      ? "bg-purple-500 text-white"
                      : "bg-green-500 text-white"
                  }`}
                >
                  {user.role}
                </span>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  user.luckyMoneyStatus === "PLAYED"
                    ? "bg-green-500/20 text-green-300 border border-green-500/50"
                    : "bg-yellow-500/20 text-yellow-300 border border-yellow-500/50"
                }`}
              >
                {user.luckyMoneyStatus === "PLAYED" ? "✅ Đã chơi" : "⏳ Chưa chơi"}
              </span>
            </div>

            {/* Info Grid */}
            <div className="space-y-2 mb-4">
              <div className="flex justify-between">
                <span className="text-gray-300 text-sm">
                  💰 Số tiền khả dụng:
                </span>
                <span className="text-yellow-200 font-semibold">
                  {user.availableAmounts.join(", ")} VNĐ
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300 text-sm">🎁 Số tiền trúng:</span>
                <span className="text-green-300 font-semibold">
                  {user.wonAmount ? `${user.wonAmount} VNĐ` : "Chưa trúng"}
                </span>
              </div>
              {user.bankInfo && (
                <div className="border-t border-white/10 pt-2 mt-2">
                  <div className="flex justify-between">
                    <span className="text-gray-300 text-sm">🏦 Ngân hàng:</span>
                    <span className="text-gray-100">
                      {user.bankInfo.bankName}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300 text-sm">📇 STK:</span>
                    <span className="text-gray-100">
                      {user.bankInfo.accountNumber}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300 text-sm">👤 Tên TK:</span>
                    <span className="text-gray-100">
                      {user.bankInfo.accountName}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={() => onEdit(user)}
                className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-red-900 font-bold py-2 px-4 rounded-lg transition-colors"
              >
                ✏️ Sửa
              </button>
              <button
                onClick={() => handleDeleteClick(user)}
                className="flex-1 bg-red-600/80 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg transition-colors"
              >
                🗑️ Xóa
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      <ConfirmDialog
        isOpen={deleteConfirm.isOpen}
        title="⚠️ Xác nhận xóa người dùng"
        message={`Bạn có chắc chắn muốn xóa người dùng "${deleteConfirm.user?.username}"? Hành động này không thể hoàn tác.`}
        confirmText="🗑️ Xóa"
        cancelText="Hủy"
        confirmColor="red"
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </>
  );
};
