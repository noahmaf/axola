import { Navigate, Outlet, useLocation } from "react-router-dom";
import Sidebar from "@/components/Sidebar";
import resizeScreen from "@/assets/images/resize-screen.png";

import AppLoading from "@/components/AppLoading";
import { useAuth } from "@/app/context/authContext";
import Navbar from "./Navbar";
import { useSessionExpiryWatcher } from "@/hooks/useSessionExpiryWatcher";

const AppLayout = () => {
  const { loading, isAuthenticated } = useAuth();
  useSessionExpiryWatcher();

  const location = useLocation();

  if (loading) {
    return <AppLoading from={location.pathname} />;
  }

  if (!isAuthenticated && !loading && location.pathname !== "/login") {
    return <Navigate to="/login" replace />;
  }

  return (
    <>
      <div className="md:hidden text-center flex flex-col justify-center items-center h-full p-12  ">
        <img src={resizeScreen} className="h-[240px] object-contain " />
        {/* Header */}
        <h1 className="text-4xl font-bold text-gray-800 mt-16">Oops!</h1>
        <p className="text-lg text-gray-600 mt-4">
          Your screen is to small to render{" "}
          <span className="text-secondary font-semibold ">Axola</span>{" "}
          perfectly. Please resize your screen
        </p>
      </div>

      <div className="md:flex h-screen hidden">
        {/* <Sidebar /> */}
        <Sidebar />

        <div className="w-full h-full flex flex-col overflow-hidden">
          {/* Sticky Header */}
          <Navbar />
          <Outlet />
        </div>
      </div>
    </>
  );
};

export default AppLayout;
