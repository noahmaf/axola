import React from "react";
import { Link, useNavigate } from "react-router-dom";

const PageNotFound: React.FC = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 text-center">
      <div className="max-w-lg">
        {/* Illustration or SVG */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 100 100"
          className="w-48 h-48 mx-auto text-secondary"
        >
          <circle
            cx="50"
            cy="50"
            r="48"
            stroke="currentColor"
            stroke-width="2"
            fill="currentColor"
            className="opacity-30"
          />

          <circle cx="35" cy="35" r="5" fill="currentColor" />

          <circle cx="65" cy="35" r="5" fill="currentColor" />

          <path
            d="M30,65 Q50,40 70,65"
            stroke="currentColor"
            stroke-width="2"
            fill="none"
          />
        </svg>

        {/* Header */}
        <h1 className="text-6xl font-bold text-gray-800 mt-6">404</h1>
        <p className="text-lg text-gray-600 mt-4">
          Oops! The page you're looking for doesn't exist.
        </p>

        {/* CTA Button */}
        <Link
          to="#"
          onClick={handleGoBack}
          className="mt-8 inline-block px-8 py-3 bg-secondary text-white text-lg font-medium rounded shadow-lg hover:bg-secondary hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 transition"
        >
          Go back
        </Link>
      </div>
    </div>
  );
};

export default PageNotFound;
