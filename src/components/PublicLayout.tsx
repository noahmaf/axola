import { Outlet } from "react-router-dom";

const PublicLayout = () => {
  return (
    <div className="h-full">
      <Outlet />
    </div>
  );
};

export default PublicLayout;
