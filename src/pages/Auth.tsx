import BackgroundImage from "@/assets/images/bg-image-v1.png";
import { Outlet } from "react-router-dom";

const Auth = () => {
  return (
    <div
      className="p-9 flex flex-col w-full h-screen bg-cover bg-center bg-no-repeat bg-fixed overflow-y-auto"
      style={{
        backgroundImage: `url(${BackgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        position: "relative",
      }}
    >
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className="flex flex-col flex-grow  items-center justify-center ">
        <Outlet />
      </div>
    </div>
  );
};

export default Auth;
