import type { ReactNode } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";
import { useEffect } from "react";
import { AuthProvider, useAuth } from "./hooks/useAuth";
import { setNavigate } from "./services/api";
import AdminLoginPage from "./pages/AdminLoginPage";
import AdminRegisterPage from "./pages/AdminRegisterPage";
import UserLoginPage from "./pages/UserLoginPage";
import AdminDashboard from "./pages/AdminDashboard";
import UserGameFlow from "./pages/UserGameFlow";
import BackgroundMusic from "./components/shared/BackgroundMusic";
import "./index.css";

// Protected route component
const ProtectedRoute = ({
  children,
  requiredRole,
}: {
  children: ReactNode;
  requiredRole: "admin" | "user";
}) => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return (
      <Navigate
        to={requiredRole === "admin" ? "/admin/login" : "/user/login"}
        replace
      />
    );
  }

  if (user?.role !== requiredRole) {
    return (
      <Navigate
        to={user?.role === "admin" ? "/admin/dashboard" : "/lucky-money"}
        replace
      />
    );
  }

  return <>{children}</>;
};

// Login route wrapper to redirect if already authenticated
const LoginRoute = ({
  children,
}: {
  children: ReactNode;
  role: "admin" | "user";
}) => {
  const { isAuthenticated, user } = useAuth();

  if (isAuthenticated && user) {
    // Redirect to appropriate dashboard if already logged in
    return (
      <Navigate
        to={user.role === "admin" ? "/admin/dashboard" : "/lucky-money"}
        replace
      />
    );
  }

  return <>{children}</>;
};

// Bridge to inject React Router navigate into api.ts (outside React)
function NavigateSetter() {
  const navigate = useNavigate();
  useEffect(() => {
    setNavigate(navigate);
  }, [navigate]);
  return null;
}

function AppRoutes() {
  return (
    <Routes>
      {/* Default redirect */}
      <Route path="/" element={<Navigate to="/user/login" replace />} />

      {/* Auth routes */}
      <Route
        path="/admin/login"
        element={
          <LoginRoute role="admin">
            <AdminLoginPage />
          </LoginRoute>
        }
      />
      <Route
        path="/admin/register"
        element={
          <LoginRoute role="admin">
            <AdminRegisterPage />
          </LoginRoute>
        }
      />
      <Route
        path="/user/login"
        element={
          <LoginRoute role="user">
            <UserLoginPage />
          </LoginRoute>
        }
      />

      {/* Protected Admin routes */}
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute requiredRole="admin">
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      {/* Protected User routes */}
      <Route
        path="/lucky-money"
        element={
          <ProtectedRoute requiredRole="user">
            <UserGameFlow />
          </ProtectedRoute>
        }
      />

      {/* 404 */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <NavigateSetter />
        <BackgroundMusic />
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
