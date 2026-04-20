import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "@/pages/Login";
import AdminLayout from "@/pages/AdminLayout";
import DashboardPage from "@/pages/Dashboard";
import MetricsPage from "@/pages/Metrics";
import LogsPage from "@/pages/Logs";
import NotFound from "@/pages/NotFound";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/admin" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<DashboardPage />} />
        <Route path="metrics" element={<MetricsPage />} />
        <Route path="logs" element={<LogsPage />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
