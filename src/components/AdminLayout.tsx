import { Navigate, Outlet } from "react-router-dom";

const AdminLayout = () => {
  const isAdmin = false;

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return (
    <div>
      AdminLayout
      <Outlet />
    </div>
  );
};

export default AdminLayout;
