import React from "react";
import { useNavigate } from "react-router-dom";

const NoActiveLobby = ({ type }) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 dark:bg-gray-800">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">
        {type == "lobby" ? `No active lobby` : "User not found"}
      </h1>
      <button
        onClick={() => navigate("/home")}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:cursor-pointer"
      >
        Back to home
      </button>
    </div>
  );
};

export default NoActiveLobby;
