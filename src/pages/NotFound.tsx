
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Logo from "@/components/Logo";

const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-explainly-light-gray p-4">
      <div className="text-center">
        <Logo size="large" />
        
        <h1 className="mt-8 text-6xl font-bold">404</h1>
        <p className="mt-4 text-xl text-explainly-text-gray">
          The page you're looking for doesn't exist
        </p>
        
        <Link to="/" className="mt-8 inline-block">
          <Button className="explainly-gradient-bg">
            Return to Home
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
