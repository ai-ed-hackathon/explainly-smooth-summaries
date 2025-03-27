
import React from "react";
import { Link } from "react-router-dom";

interface LogoProps {
  size?: "small" | "medium" | "large";
}

const Logo: React.FC<LogoProps> = ({ size = "medium" }) => {
  const sizeClasses = {
    small: "text-xl",
    medium: "text-2xl",
    large: "text-4xl",
  };

  return (
    <Link to="/" className={`font-bold ${sizeClasses[size]} tracking-tight`}>
      expla<span className="explainly-gradient-text">i</span>nly
    </Link>
  );
};

export default Logo;
