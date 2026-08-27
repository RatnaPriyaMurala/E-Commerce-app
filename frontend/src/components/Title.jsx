import React from "react";

const Title = ({ text1, text2 }) => {
  return (
    <div className="flex items-center justify-center gap-4 mb-6">
      <div className="w-10 md:w-16 h-[2px] bg-teal-600 rounded-full" />

      <h2 className="text-3xl md:text-4xl font-bold tracking-wide">
        <span className="text-gray-500">
          {text1}
        </span>{" "}

        <span className="text-teal-700">
          {text2}
        </span>
      </h2>

      <div className="w-10 md:w-16 h-[2px] bg-teal-600 rounded-full" />
    </div>
  );
};

export default Title;