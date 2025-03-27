
import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import SummaryPreview from "./SummaryPreview";

const HeroSection: React.FC = () => {
  return (
    <div className="w-full flex flex-col lg:flex-row items-center justify-between py-12 px-6 gap-12">
      <div className="w-full lg:w-1/2 space-y-6 animate-fadeIn">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
          Understand more.
          <br />
          Faster. Powered by AI.
        </h1>
        
        <p className="text-lg text-explainly-text-gray max-w-md">
          Generate summaries, quizzes, and interactive content to accelerate
          your learning.
        </p>
        
        <Link to="/dashboard">
          <Button size="lg" className="explainly-gradient-bg hover:opacity-90 transition-opacity text-white font-medium">
            Get Started
          </Button>
        </Link>
      </div>
      
      <div className="w-full lg:w-1/2 flex justify-center animate-slideInUp">
        <SummaryPreview />
      </div>
    </div>
  );
};

export default HeroSection;
