import { useState } from "react";
import toast from "react-hot-toast";
import { ConfirmDialog } from "../shared/ConfirmDialog";

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
  isTransferred?: boolean;
}

interface UserTableProps {
  users: User[];
  onEdit: (user: User) => void;
  onDelete: (userId: string) => void;
  onReset: (userId: string) => void;
  onToggleTransferred: (userId: string) => void;
}

const roleDisplay: Record<string, { label: string; color: string }> = {
  LOVER: {
    label: "Người yêu",
    color: "bg-pink-500/20 text-pink-200 border border-pink-400/30",
  },
  FRIEND: {
    label: "Bạn bè",
    color: "bg-orange-500/20 text-orange-200 border border-orange-400/30",
  },
  COLLEAGUE: {
    label: "Đồng nghiệp",
    color: "bg-red-500/20 text-red-200 border border-red-400/30",
  },
  FAMILY: {
    label: "Gia đình",
    color: "bg-purple-500/20 text-purple-200 border border-purple-400/30",
  },
};

const roleMobileColor: Record<string, string> = {
  LOVER: "bg-pink-500 text-white",
  FRIEND: "bg-orange-500 text-white",
  COLLEAGUE: "bg-red-600 text-white",
  FAMILY: "bg-purple-500 text-white",
};

const copyBankInfo = (user: User) => {
  if (!user.bankInfo) return;
  const parts = [
    user.bankInfo.bankName,
    user.bankInfo.accountNumber,
    user.bankInfo.accountName,
  ].filter(Boolean);
  navigator.clipboard.writeText(parts.join(" - "));
  toast.success("Đã sao chép thông tin ngân hàng");
};

export const UserTable = ({
  users,
  onEdit,
  onDelete,
  onReset,
  onToggleTransferred,
}: UserTableProps) => {
  const [deleteConfirm, setDeleteConfirm] = useState<{
    isOpen: boolean;
    user: User | null;
  }>({
    isOpen: false,
    user: null,
  });

  const [resetConfirm, setResetConfirm] = useState<{
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

  const handleResetClick = (user: User) => {
    setResetConfirm({ isOpen: true, user });
  };

  const handleConfirmReset = () => {
    if (resetConfirm.user) {
      onReset(resetConfirm.user._id);
    }
    setResetConfirm({ isOpen: false, user: null });
  };

  const handleCancelReset = () => {
    setResetConfirm({ isOpen: false, user: null });
  };

  if (users.length === 0) {
    return (
      <div className="text-center py-16 bg-white/5 backdrop-blur-md rounded-2xl border border-yellow-400/20">
        <div className="text-6xl mb-4">🧧</div>
        <p className="text-yellow-200/70 text-lg">Chưa có người dùng nào</p>
      </div>
    );
  }

  return (
    <>
      {/* Desktop Table View */}
      <div className="hidden lg:block overflow-x-auto bg-white/10 backdrop-blur-md rounded-2xl border border-yellow-400/20 shadow-2xl">
        <table className="min-w-full divide-y divide-yellow-400/20">
          <thead className="bg-gradient-to-r from-red-600/50 to-red-700/50">
            <tr>
              <th className="px-4 py-4 text-left text-xs font-bold text-yellow-200 uppercase tracking-wider">
                Tên
              </th>
              <th className="px-4 py-4 text-left text-xs font-bold text-yellow-200 uppercase tracking-wider">
                Tên đăng nhập
              </th>
              <th className="px-4 py-4 text-left text-xs font-bold text-yellow-200 uppercase tracking-wider">
                Vai trò
              </th>
              <th className="px-4 py-4 text-left text-xs font-bold text-yellow-200 uppercase tracking-wider">
                Trạng thái
              </th>
              <th className="px-4 py-4 text-left text-xs font-bold text-yellow-200 uppercase tracking-wider">
                Số tiền trúng
              </th>
              <th className="px-4 py-4 text-left text-xs font-bold text-yellow-200 uppercase tracking-wider">
                Thông tin NH
              </th>
              <th className="px-4 py-4 text-center text-xs font-bold text-yellow-200 uppercase tracking-wider">
                Chuyển khoản
              </th>
              <th className="px-4 py-4 text-right text-xs font-bold text-yellow-200 uppercase tracking-wider">
                Hành động
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-yellow-400/10">
            {users.map((user) => {
              const role = roleDisplay[user.role] || {
                label: user.role,
                color: "bg-gray-500/20 text-gray-200 border border-gray-400/30",
              };
              return (
                <tr
                  key={user._id}
                  className="hover:bg-red-500/10 transition-colors"
                >
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="text-sm font-medium text-white">
                      {user.name || (
                        <span className="text-gray-400 italic">-</span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="text-sm text-gray-300">{user.username}</div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span
                      className={`px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${role.color}`}
                    >
                      {role.label}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span
                      className={`px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        user.luckyMoneyStatus === "PLAYED"
                          ? "bg-green-500/20 text-green-200 border border-green-400/30"
                          : "bg-gray-500/20 text-gray-200 border border-gray-400/30"
                      }`}
                    >
                      {user.luckyMoneyStatus === "PLAYED"
                        ? "Đã chơi"
                        : "Chưa chơi"}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="text-sm font-bold text-yellow-300">
                      {user.wonAmount
                        ? `${user.wonAmount.toLocaleString("vi-VN")} đ`
                        : "-"}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    {user.bankInfo ? (
                      <div className="flex items-start gap-2">
                        <div className="text-sm text-white min-w-0">
                          <div className="font-medium">
                            {user.bankInfo.bankName}
                          </div>
                          <div className="text-gray-300 font-mono text-xs">
                            {user.bankInfo.accountNumber}
                          </div>
                          {user.bankInfo.accountName && (
                            <div className="text-gray-400 text-xs">
                              {user.bankInfo.accountName}
                            </div>
                          )}
                        </div>
                        <button
                          onClick={() => copyBankInfo(user)}
                          className="text-yellow-400 hover:text-yellow-200 transition-colors flex-shrink-0 mt-0.5"
                          title="Sao chép thông tin NH"
                        >
                          📋
                        </button>
                      </div>
                    ) : (
                      <span className="text-sm text-gray-500 italic">
                        Chưa có
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {user.luckyMoneyStatus === "PLAYED" && (
                      <button
                        onClick={() => onToggleTransferred(user._id)}
                        className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                          user.isTransferred
                            ? "bg-green-500/30 text-green-200 border border-green-400/40 hover:bg-green-500/50"
                            : "bg-gray-500/20 text-gray-300 border border-gray-400/30 hover:bg-yellow-500/20 hover:text-yellow-200 hover:border-yellow-400/30"
                        }`}
                      >
                        {user.isTransferred ? "✅ Đã chuyển" : "⬜ Chưa"}
                      </button>
                    )}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => onEdit(user)}
                        className="text-yellow-300 hover:text-yellow-100 transition-colors px-1.5 py-1"
                        title="Sửa"
                      >
                        ✏️
                      </button>
                      {user.luckyMoneyStatus === "PLAYED" && (
                        <button
                          onClick={() => handleResetClick(user)}
                          className="text-blue-300 hover:text-blue-100 transition-colors px-1.5 py-1"
                          title="Reset trạng thái"
                        >
                          🔄
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteClick(user)}
                        className="text-red-300 hover:text-red-100 transition-colors px-1.5 py-1"
                        title="Xóa"
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="lg:hidden space-y-4">
        {users.map((user) => {
          const role = roleDisplay[user.role];
          return (
            <div
              key={user._id}
              className="bg-white/10 backdrop-blur-md rounded-lg p-4 border border-yellow-400/30 shadow-lg"
            >
              {/* Header: Name & Status */}
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="text-lg font-bold text-yellow-200">
                    {user.name || user.username}
                  </h3>
                  {user.name && (
                    <p className="text-sm text-gray-300 mt-0.5">
                      {user.username}
                    </p>
                  )}
                  <span
                    className={`inline-block mt-1 px-2 py-1 text-xs rounded-full font-semibold ${
                      roleMobileColor[user.role] || "bg-gray-500 text-white"
                    }`}
                  >
                    {role?.label || user.role}
                  </span>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      user.luckyMoneyStatus === "PLAYED"
                        ? "bg-green-500/20 text-green-300 border border-green-500/50"
                        : "bg-yellow-500/20 text-yellow-300 border border-yellow-500/50"
                    }`}
                  >
                    {user.luckyMoneyStatus === "PLAYED"
                      ? "Đã chơi"
                      : "Chưa chơi"}
                  </span>
                  {user.luckyMoneyStatus === "PLAYED" && (
                    <button
                      onClick={() => onToggleTransferred(user._id)}
                      className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                        user.isTransferred
                          ? "bg-green-500/30 text-green-200 border border-green-400/40"
                          : "bg-gray-500/20 text-gray-300 border border-gray-400/30"
                      }`}
                    >
                      {user.isTransferred ? "✅ Đã chuyển" : "⬜ Chưa chuyển"}
                    </button>
                  )}
                </div>
              </div>

              {/* Info Grid */}
              <div className="space-y-2 mb-4">
                <div className="flex justify-between">
                  <span className="text-gray-300 text-sm">
                    💰 Lì xì có sẵn:
                  </span>
                  <span className="text-yellow-200 font-semibold text-sm">
                    {user.availableAmounts
                      .map((a) => a.toLocaleString("vi-VN"))
                      .join(", ")}{" "}
                    đ
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300 text-sm">
                    🎁 Số tiền trúng:
                  </span>
                  <span className="text-green-300 font-semibold">
                    {user.wonAmount
                      ? `${user.wonAmount.toLocaleString("vi-VN")} đ`
                      : "Chưa trúng"}
                  </span>
                </div>
                {user.bankInfo && (
                  <div className="border-t border-white/10 pt-2 mt-2">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-gray-300 text-sm">
                        🏦 Ngân hàng
                      </span>
                      <button
                        onClick={() => copyBankInfo(user)}
                        className="text-xs text-yellow-400 hover:text-yellow-200"
                      >
                        📋 Sao chép
                      </button>
                    </div>
                    <div className="bg-white/5 rounded-lg p-2 space-y-1">
                      <div className="text-gray-100 text-sm font-medium">
                        {user.bankInfo.bankName}
                      </div>
                      <div className="text-gray-300 text-sm font-mono">
                        {user.bankInfo.accountNumber}
                      </div>
                      {user.bankInfo.accountName && (
                        <div className="text-gray-400 text-xs">
                          {user.bankInfo.accountName}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <button
                  onClick={() => onEdit(user)}
                  className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-red-900 font-bold py-2 px-3 rounded-lg transition-colors text-sm"
                >
                  ✏️ Sửa
                </button>
                {user.luckyMoneyStatus === "PLAYED" && (
                  <button
                    onClick={() => handleResetClick(user)}
                    className="bg-blue-600/70 hover:bg-blue-500/70 text-white font-bold py-2 px-3 rounded-lg transition-colors text-sm"
                  >
                    🔄
                  </button>
                )}
                <button
                  onClick={() => handleDeleteClick(user)}
                  className="flex-1 bg-red-600/80 hover:bg-red-600 text-white font-bold py-2 px-3 rounded-lg transition-colors text-sm"
                >
                  🗑️ Xóa
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <ConfirmDialog
        isOpen={deleteConfirm.isOpen}
        title="Xác nhận xóa người dùng"
        message={`Bạn có chắc chắn muốn xóa người dùng "${deleteConfirm.user?.username}"? Hành động này không thể hoàn tác.`}
        confirmText="Xóa"
        cancelText="Hủy"
        confirmColor="red"
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />

      <ConfirmDialog
        isOpen={resetConfirm.isOpen}
        title="Xác nhận reset trạng thái"
        message={`Reset người dùng "${resetConfirm.user?.username}"? Trạng thái lì xì, số tiền trúng và thông tin ngân hàng sẽ bị xóa.`}
        confirmText="Reset"
        cancelText="Hủy"
        confirmColor="blue"
        onConfirm={handleConfirmReset}
        onCancel={handleCancelReset}
      />
    </>
  );
};
