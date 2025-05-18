import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const isAdmin = true;

    if (!isAdmin) {
      navigate("/");
    }
  }, []);

  return <div>Dashboard </div>;
};

export default Dashboard;
