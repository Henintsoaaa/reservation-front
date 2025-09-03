import React from "react";

const BackgroundDecorations: React.FC = () => {
  return (
    <>
      {/* Main overlay */}
      <div className="absolute inset-0 bg-black/30"></div>

      {/* Animated gradient orbs */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-blue-500/30 to-cyan-500/30 rounded-full blur-3xl animate-float"></div>
      <div
        className="absolute top-1/2 right-0 w-[500px] h-[500px] bg-gradient-to-br from-purple-500/25 to-pink-500/25 rounded-full blur-3xl animate-float"
        style={{ animationDelay: "3s" }}
      ></div>
      <div
        className="absolute bottom-0 left-1/3 w-80 h-80 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-full blur-3xl animate-float"
        style={{ animationDelay: "1.5s" }}
      ></div>

      {/* Additional subtle decorations */}
      <div
        className="absolute top-1/4 right-1/4 w-64 h-64 bg-gradient-to-br from-emerald-500/15 to-teal-500/15 rounded-full blur-2xl animate-float"
        style={{ animationDelay: "4s" }}
      ></div>
      <div
        className="absolute bottom-1/4 left-10 w-48 h-48 bg-gradient-to-br from-rose-500/15 to-orange-500/15 rounded-full blur-2xl animate-float"
        style={{ animationDelay: "2.5s" }}
      ></div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.3) 1px, transparent 0)`,
            backgroundSize: "30px 30px",
          }}
        ></div>
      </div>

      {/* Subtle gradient mesh */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-blue-900/10 to-purple-900/20"></div>
    </>
  );
};

export default BackgroundDecorations;
