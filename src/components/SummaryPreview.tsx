
import React from "react";
import { Folder, Circle } from "lucide-react";

const SummaryPreview: React.FC = () => {
  return (
    <div className="w-full max-w-md p-6 bg-explainly-light-gray rounded-2xl shadow-subtle relative overflow-hidden">
      <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-transparent to-blue-50 opacity-60"></div>
      
      <div className="relative z-10">
        <div className="flex items-center gap-2 text-explainly-navy mb-4">
          <Folder className="h-5 w-5 text-explainly-blue" />
          <span className="font-medium">Transcript</span>
        </div>
        
        <div className="bg-white p-4 rounded-xl shadow-subtle mb-4">
          <h3 className="font-semibold text-lg mb-2">Summary</h3>
          <div className="space-y-2">
            <div className="loading-line w-full"></div>
            <div className="loading-line w-5/6"></div>
            <div className="loading-line w-4/6"></div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-xl shadow-subtle">
          <h3 className="font-semibold text-lg mb-2">Quiz Question</h3>
          <div className="space-y-3">
            <div className="loading-line w-5/6"></div>
            <div className="flex items-center gap-2">
              <Circle className="h-4 w-4 text-gray-300" />
              <div className="loading-line w-3/4 my-0"></div>
            </div>
            <div className="flex items-center gap-2">
              <Circle className="h-4 w-4 text-gray-300" />
              <div className="loading-line w-4/5 my-0"></div>
            </div>
            <div className="flex items-center gap-2">
              <Circle className="h-4 w-4 text-gray-300" />
              <div className="loading-line w-2/3 my-0"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SummaryPreview;
