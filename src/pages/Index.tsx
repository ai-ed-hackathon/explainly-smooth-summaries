
import React from "react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";

const Index: React.FC = () => {
  const { user } = useAuth();

  // Redirect to dashboard if already logged in
  if (user) {
    return <Navigate to="/dashboard" />;
  }

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
