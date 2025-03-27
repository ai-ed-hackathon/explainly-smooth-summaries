
import React from "react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Upload, BookOpen, BrainCircuit } from "lucide-react";
import { Link } from "react-router-dom";

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
        
        {/* Features Section */}
        <section className="py-16 bg-explainly-light-gray">
          <div className="container mx-auto max-w-7xl">
            <h2 className="text-3xl font-bold text-center mb-12">How Explainly Works</h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <div className="w-12 h-12 bg-explainly-light-blue rounded-full flex items-center justify-center mb-4">
                  <Upload className="h-6 w-6 text-explainly-blue" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Upload Transcript</h3>
                <p className="text-explainly-text-gray">
                  Simply upload your lecture transcript file. We support various formats including TXT, PDF, DOC, and DOCX.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <div className="w-12 h-12 bg-explainly-light-blue rounded-full flex items-center justify-center mb-4">
                  <BrainCircuit className="h-6 w-6 text-explainly-blue" />
                </div>
                <h3 className="text-xl font-semibold mb-2">AI Processing</h3>
                <p className="text-explainly-text-gray">
                  Our AI automatically analyzes your transcript, extracts key concepts, and generates a concise, structured summary.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <div className="w-12 h-12 bg-explainly-light-blue rounded-full flex items-center justify-center mb-4">
                  <BookOpen className="h-6 w-6 text-explainly-blue" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Learn Efficiently</h3>
                <p className="text-explainly-text-gray">
                  Review your AI-generated summary, key concepts, and quiz questions to enhance your understanding and retention.
                </p>
              </div>
            </div>
            
            <div className="mt-12 text-center">
              <Link to="/signup">
                <Button className="explainly-gradient-bg text-white px-6 py-2 rounded-md text-lg">
                  Get Started <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Index;
