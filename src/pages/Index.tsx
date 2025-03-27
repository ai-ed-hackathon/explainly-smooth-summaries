
import React from "react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";

const Index: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <main className="flex-1 flex flex-col">
        <div className="container mx-auto max-w-7xl flex-1 flex items-center">
          <HeroSection />
        </div>
      </main>
    </div>
  );
};

export default Index;
