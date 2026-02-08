import type { ReactNode } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./hooks/useAuth";
import AdminLoginPage from "./pages/AdminLoginPage";
import AdminRegisterPage from "./pages/AdminRegisterPage";
import UserLoginPage from "./pages/UserLoginPage";
import AdminDashboard from "./pages/AdminDashboard";
import UserGameFlow from "./pages/UserGameFlow";
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
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
