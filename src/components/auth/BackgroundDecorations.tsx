import React from "react";

const BackgroundDecorations: React.FC = () => {
  return (
    <>
      <div className="absolute inset-0 bg-black/20"></div>
      <div className="absolute top-0 left-0 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl"></div>
      <div className="absolute top-1/2 right-0 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-pink-500/20 rounded-full blur-3xl"></div>
    </>
  );
};

export default BackgroundDecorations;
