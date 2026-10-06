import React from "react";

const Title = ({ text1, text2 }) => {
  return (
    <div className="mb-3 flex items-center justify-center gap-2 sm:gap-2.5">
      <div className="h-[2px] w-6 rounded-full bg-teal-600 sm:w-9 md:w-12" />

      <h2 className="text-2xl font-bold tracking-wide sm:text-3xl md:text-4xl">
        <span className="text-gray-500">{text1}</span>{" "}
        <span className="text-teal-700">{text2}</span>
      </h2>

      <div className="h-[2px] w-6 rounded-full bg-teal-600 sm:w-9 md:w-12" />
    </div>
  );
};

export default Title;