import { useAuth } from "@/app/context/authContext";
import loadingWebm from "@/assets/animations/AppLoading.webm";
import { Navigate } from "react-router-dom";

const AppLoading = ({ from }: { from: string }) => {
  const { user, loading } = useAuth();

  if (user !== undefined && !loading) {
    return <Navigate to={from} replace />;
  }
  return (
    <div className="h-screen bg-secondary bg-opacity-5 w-full text-secondary justify-center flex items-center">
      <video src={loadingWebm} autoPlay loop muted className="w-40 h-40" />
    </div>
  );
};

export default AppLoading;
