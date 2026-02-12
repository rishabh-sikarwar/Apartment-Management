import React from "react";

// Color definitions for the icon background and text
const variants = {
  purple: "bg-purple-100 text-purple-600",
  blue: "bg-blue-100 text-blue-600",
  emerald: "bg-emerald-100 text-emerald-600",
  orange: "bg-orange-100 text-orange-600",
  rose: "bg-rose-100 text-rose-600",
  default: "bg-gray-100 text-gray-600",
};

export default function Section({
  title,
  description,
  icon,
  variant = "default",
}) {
  // Select the color class based on the variant prop
  const colorClass = variants[variant] || variants.default;

  return (
    <div className="group h-full p-6 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col">
      <div className="flex items-start justify-between mb-4">
        {/* Icon Container with Dynamic Color */}
        <div className={`p-3 rounded-xl ${colorClass} transition-colors`}>
          {/* If an icon is passed, clone it to force specific sizing, otherwise show nothing */}
          {icon && React.cloneElement(icon, { className: "w-6 h-6" })}
        </div>
      </div>

      <h2 className="text-lg font-bold text-gray-900 group-hover:text-blue-700 transition-colors mb-2">
        {title}
      </h2>

      <p className="text-sm text-gray-500 leading-relaxed font-medium">
        {description}
      </p>
    </div>
  );
}
