
import React, { useState, useEffect } from "react";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import Sidebar from "@/components/dashboard/Sidebar";
import UploadModal from "@/components/dashboard/UploadModal";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [hasTranscripts, setHasTranscripts] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkForTranscripts = async () => {
      if (!user) return;
      
      try {
        const { count, error } = await supabase
          .from('transcripts')
          .select('*', { count: 'exact', head: true });
          
        if (error) throw error;
        
        setHasTranscripts(count !== null && count > 0);
      } catch (error) {
        console.error('Error checking for transcripts:', error);
      } finally {
        setLoading(false);
      }
    };

    checkForTranscripts();
  }, [user]);

  const handleUploadSuccess = () => {
    setHasTranscripts(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-explainly-light-gray">
      <DashboardHeader onUploadClick={() => setUploadModalOpen(true)} />
      
      <div className="flex-1 flex">
        <Sidebar />
        
        <div className="flex-1 flex flex-col p-6">
          {loading ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="animate-spin w-8 h-8 border-4 border-t-explainly-blue border-r-transparent border-b-explainly-blue border-l-transparent rounded-full"></div>
            </div>
          ) : !hasTranscripts ? (
            <div className="flex-1 flex flex-col items-center justify-center max-w-md mx-auto text-center">
              <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                <div className="w-16 h-16 bg-explainly-light-gray rounded-full flex items-center justify-center mx-auto mb-4">
                  <Upload className="h-8 w-8 text-explainly-blue" />
                </div>
                <h2 className="text-xl font-bold mb-2">Upload your first transcript</h2>
                <p className="text-explainly-text-gray mb-6">
                  Upload a lecture transcript to get started with AI-powered summaries and quizzes.
                </p>
                <Button 
                  className="explainly-gradient-bg"
                  onClick={() => setUploadModalOpen(true)}
                >
                  Upload Transcript
                </Button>
              </div>
            </div>
          ) : (
            <div className="max-w-4xl mx-auto w-full">
              <h1 className="text-2xl font-bold mb-6">Welcome to Explainly</h1>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <h2 className="text-lg font-semibold mb-4">Get Started</h2>
                  <p className="text-explainly-text-gray mb-4">
                    Select a transcript from the sidebar to view its summary, key concepts, and quiz questions.
                  </p>
                  <Button 
                    className="explainly-gradient-bg w-full"
                    onClick={() => setUploadModalOpen(true)}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Another Transcript
                  </Button>
                </div>
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <h2 className="text-lg font-semibold mb-2">How it works</h2>
                  <ol className="list-decimal pl-4 space-y-2 text-explainly-text-gray">
                    <li>Upload a transcript file</li>
                    <li>AI processes and analyzes the content</li>
                    <li>Review generated summaries</li>
                    <li>Study with key concepts and quizzes</li>
                  </ol>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <UploadModal 
        open={uploadModalOpen} 
        onOpenChange={setUploadModalOpen}
        onUploadSuccess={handleUploadSuccess}
      />
    </div>
  );
};

export default Dashboard;
