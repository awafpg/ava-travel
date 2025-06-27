import React from "react";

const AuthButtons = (handleLogin, handleRegister) => {
  const token = localStorage.getItem("token");

  return (
    <>
      {!token && (
        <div className="space-y-2">
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition w-full"
            onClick={handleLogin}
          >
            Login
          </button>
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition w-full"
            onClick={handleRegister}
          >
            Register
          </button>
        </div>
      )}
    </>
  );
};

export default AuthButtons;
