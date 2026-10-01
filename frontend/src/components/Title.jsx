import React from "react";

const Title = ({ text1, text2 }) => {
  return (
    <div className="flex items-center justify-center gap-2.5 sm:gap-3 mb-4">
      <div className="w-7 sm:w-10 md:w-14 h-[2px] bg-teal-600 rounded-full" />

      <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-wide">
        <span className="text-gray-500">
          {text1}
        </span>{" "}

        <span className="text-teal-700">
          {text2}
        </span>
      </h2>

      <div className="w-7 sm:w-10 md:w-14 h-[2px] bg-teal-600 rounded-full" />
    </div>
  );
};

export default Title;