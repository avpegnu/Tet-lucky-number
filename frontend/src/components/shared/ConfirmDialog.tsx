import { motion, AnimatePresence } from "framer-motion";

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmColor?: "red" | "yellow" | "blue";
}

export const ConfirmDialog = ({
  isOpen,
  title,
  message,
  confirmText = "Xác nhận",
  cancelText = "Hủy",
  onConfirm,
  onCancel,
  confirmColor = "red",
}: ConfirmDialogProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
            onClick={onCancel}
          />
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-gradient-to-br from-red-700 via-red-800 to-red-900 rounded-2xl shadow-2xl p-8 max-w-md w-full border-4 border-yellow-400/30 relative pointer-events-auto"
            >
              {/* Decorative elements */}
              <div className="absolute -top-3 -right-3 text-4xl animate-bounce">
                ⚠️
              </div>

              <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-yellow-200 to-yellow-400 bg-clip-text text-transparent pb-1">
                {title}
              </h2>
              <p className="text-yellow-100 mb-6 text-lg">{message}</p>

              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onCancel}
                  className="flex-1 bg-gray-600/50 text-white px-6 py-3 rounded-lg font-bold hover:bg-gray-500/50 transition-all border border-gray-400/30"
                >
                  {cancelText}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onConfirm}
                  className={`flex-1 px-6 py-3 rounded-lg font-bold transition-all shadow-lg ${
                    confirmColor === "red"
                      ? "bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-400 hover:to-red-500"
                      : confirmColor === "blue"
                      ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-400 hover:to-blue-500"
                      : "bg-gradient-to-r from-yellow-400 to-yellow-500 text-red-900 hover:from-yellow-300 hover:to-yellow-400"
                  }`}
                >
                  {confirmText}
                </motion.button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};
