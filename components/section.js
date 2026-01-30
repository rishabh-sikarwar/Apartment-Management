import React from "react";

export default function Section({ title, description }) {
  return (
    <div className="h-full p-6 bg-white rounded-xl shadow-md border border-gray-100 hover:shadow-xl hover:border-blue-200 transition-all duration-300 cursor-pointer flex flex-col">
      <h2 className="text-xl font-bold mb-3 text-blue-900">{title}</h2>
      <p className="text-gray-600 text-sm leading-relaxed font-medium">
        {description}
      </p>
    </div>
  );
}
