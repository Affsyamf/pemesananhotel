// frontend/src/components/AuthLayout.jsx
import React from 'react';

function AuthLayout({ title, children }) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center">
      <div className="max-w-md w-full mx-auto">
        <h2 className="text-3xl font-extrabold text-center text-gray-900 mb-8">
          {title}
        </h2>
        <div className="bg-white p-8 rounded-lg shadow-lg">
          {children}
        </div>
      </div>
    </div>
  );
}

export default AuthLayout;