import { ProtectedRoute } from "@/components/ProtectedRoute";
import { AdminDashboard } from "@/components/AdminDashboard";

const Admin = () => {
  return (
    <ProtectedRoute>
      <AdminDashboard />
    </ProtectedRoute>
  );
};

export default Admin;