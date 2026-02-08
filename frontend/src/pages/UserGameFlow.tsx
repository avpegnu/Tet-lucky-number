import { useState, useEffect } from "react";
import type { FormEvent } from "react";
import { AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { useAuth } from "../hooks/useAuth";
import { luckyMoneyAPI } from "../services/api";
import { GreetingScreen } from "../components/lucky-money/GreetingScreen";
import { DrawScreen } from "../components/lucky-money/DrawScreen";
import { BankInfoScreen } from "../components/lucky-money/BankInfoScreen";
import { ThankYouScreen } from "../components/lucky-money/ThankYouScreen";
import { FloatingLanterns } from "../components/shared/FloatingLanterns";
import { FallingBlossoms } from "../components/shared/FallingBlossoms";

interface GreetingConfig {
  role: string;
  message: string;
  name?: string | null;
  theme: {
    background: string;
    primaryColor: string;
    secondaryColor: string;
  };
}

interface UserStatus {
  name?: string | null;
  luckyMoneyStatus: string;
  wonAmount: number;
  bankInfo: {
    bankName: string;
    accountNumber: string;
    accountName?: string | null;
  } | null;
  availableAmounts?: number[];
}

const UserGameFlow = () => {
  const { logout } = useAuth();
  const [config, setConfig] = useState<GreetingConfig | null>(null);
  const [status, setStatus] = useState<UserStatus | null>(null);
  const [stage, setStage] = useState<
    "greeting" | "draw" | "bank-info" | "thank-you"
  >("greeting");
  const [isDrawing, setIsDrawing] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [bankForm, setBankForm] = useState({
    bankName: "",
    accountNumber: "",
    accountName: "",
  });

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const [configRes, statusRes] = await Promise.all([
        luckyMoneyAPI.getConfig(),
        luckyMoneyAPI.getStatus(),
      ]);
      setConfig(configRes.data);
      setStatus(statusRes.data);

      // If already played, skip to result
      if (statusRes.data.luckyMoneyStatus === "PLAYED") {
        if (statusRes.data.bankInfo) {
          setStage("thank-you");
        } else {
          setStage("bank-info");
        }
      }
    } catch (err) {
      console.error("Failed to load data:", err);
      if (err instanceof Error && "response" in err) {
        const error = err as { response?: { status?: number } };
        if (error.response?.status === 401) {
          toast.error("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.");
          logout();
          return;
        }
      }
      toast.error("Không thể tải dữ liệu. Vui lòng thử lại.");
    }
  }

  const handleDraw = async () => {
    setIsDrawing(true);

    // Simulate envelope animation - wait for shake and open
    setTimeout(async () => {
      try {
        const response = await luckyMoneyAPI.draw();
        setStatus((prev) => ({
          ...prev!,
          wonAmount: response.data.wonAmount,
          luckyMoneyStatus: "PLAYED",
        }));
        setShowConfetti(true);

        // Show confetti then move to bank info
        setTimeout(() => {
          setShowConfetti(false);
          setIsDrawing(false);
          setStage("bank-info");
        }, 3000);
      } catch (error) {
        toast.error("Đã có lỗi xảy ra. Vui lòng thử lại.");
        setIsDrawing(false);
      }
    }, 2000);
  };

  const handleSubmitBankInfo = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await luckyMoneyAPI.submitBankInfo(bankForm);
      // Reload status to get the updated bankInfo
      const statusRes = await luckyMoneyAPI.getStatus();
      setStatus(statusRes.data);
      setStage("thank-you");
    } catch (error) {
      toast.error("Không thể gửi thông tin. Vui lòng thử lại.");
    }
  };

  if (!config || !status) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-tet-red-600">
        <div className="text-white text-xl">Đang tải...</div>
      </div>
    );
  }

  const themeStyle = {
    background: config.theme.background,
  };

  return (
    <div className="min-h-screen relative overflow-hidden" style={themeStyle}>
      {/* Decorative Elements - Floating Lanterns */}
      <FloatingLanterns />
      <FallingBlossoms />

      {/* Logout button */}
      <div className="absolute top-4 right-4 z-10">
        <button
          onClick={logout}
          className="bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-lg hover:bg-white/30 transition shadow-lg"
        >
          Đăng xuất
        </button>
      </div>

      <AnimatePresence mode="wait">
        {stage === "greeting" && (
          <GreetingScreen
            key="greeting"
            config={config}
            onNext={() => setStage("draw")}
          />
        )}
        {stage === "draw" && (
          <DrawScreen
            key="draw"
            isDrawing={isDrawing}
            showConfetti={showConfetti}
            wonAmount={status.wonAmount}
            availableAmounts={status.availableAmounts || []}
            onDraw={handleDraw}
          />
        )}
        {stage === "bank-info" && (
          <BankInfoScreen
            key="bank-info"
            wonAmount={status.wonAmount}
            bankForm={bankForm}
            setBankForm={setBankForm}
            onSubmit={handleSubmitBankInfo}
          />
        )}
        {stage === "thank-you" && (
          <ThankYouScreen
            key="thank-you"
            wonAmount={status.wonAmount}
            bankInfo={status.bankInfo!}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default UserGameFlow;
