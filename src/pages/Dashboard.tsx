
import React, { useState } from "react";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import Sidebar from "@/components/dashboard/Sidebar";
import SummaryView from "@/components/dashboard/SummaryView";
import UploadModal from "@/components/dashboard/UploadModal";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";

const Dashboard: React.FC = () => {
  const [uploadModalOpen, setUploadModalOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-explainly-light-gray">
      <DashboardHeader />
      
      <div className="flex-1 flex">
        <Sidebar />
        
        <div className="flex-1 flex flex-col">
          <SummaryView />
        </div>
      </div>
      
      <Button
        className="fixed bottom-6 right-6 explainly-gradient-bg shadow-lg"
        size="lg"
        onClick={() => setUploadModalOpen(true)}
      >
        <Upload className="h-5 w-5 mr-2" />
        Upload Transcript
      </Button>
      
      <UploadModal 
        open={uploadModalOpen} 
        onOpenChange={setUploadModalOpen} 
      />
    </div>
  );
};

export default Dashboard;
