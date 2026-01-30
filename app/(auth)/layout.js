import React from "react";

const AuthLayout = ({ children }) => {
  return (
    // Changed to a professional Slate/Gray background
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4 md:p-6">
      {/* Container constraints */}
      <div className="w-full max-w-6xl">{children}</div>
    </div>
  );
};

export default AuthLayout;
