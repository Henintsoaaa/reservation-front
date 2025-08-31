import React from "react";

const WelcomeSection: React.FC = () => {
  return (
    <div className="text-center lg:text-left space-y-8">
      <div className="space-y-4">
        <h1 className="text-5xl lg:text-7xl font-bold bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent leading-tight">
          Welcome
        </h1>
        <h2 className="text-2xl lg:text-4xl font-semibold text-white/90">
          to our Platform
        </h2>
        <p className="text-xl text-white/70 max-w-lg">
          Book your best venue easily and quickly.
        </p>
      </div>
    </div>
  );
};

export default WelcomeSection;
