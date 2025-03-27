
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, Share2 } from "lucide-react";
import { toast } from "sonner";

interface SummaryViewProps {
  title?: string;
}

const SummaryView: React.FC<SummaryViewProps> = ({ 
  title = "Introduction to Machine Learning" 
}) => {
  const handleDownload = () => {
    toast.success("Download functionality will be implemented soon");
  };

  const handleShare = () => {
    toast.success("Share functionality will be implemented soon");
  };

  return (
    <div className="h-full p-6 overflow-y-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">{title}</h1>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={handleShare}>
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
          <Button variant="outline" size="sm" onClick={handleDownload}>
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
        </div>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-explainly-text-gray">
              Machine Learning (ML) is a subset of Artificial Intelligence that enables computers to learn from data without explicit programming. The lecture introduces fundamental concepts including supervised learning (training models with labeled data) and unsupervised learning (finding patterns in unlabeled data).
            </p>
            <p className="text-explainly-text-gray mt-4">
              Key algorithms discussed include linear regression for predicting continuous values, classification for categorical predictions, and clustering for grouping similar data points. The importance of data preprocessing, feature selection, and model evaluation metrics like accuracy and precision are emphasized throughout the lecture.
            </p>
            <p className="text-explainly-text-gray mt-4">
              The lecture concludes with practical applications of ML in various industries and the ethical considerations surrounding algorithm bias and data privacy.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Key Concepts</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-5 space-y-2 text-explainly-text-gray">
              <li>Supervised vs. Unsupervised Learning</li>
              <li>Training and Test Data Splits</li>
              <li>Feature Selection and Engineering</li>
              <li>Model Evaluation Metrics</li>
              <li>Overfitting and Underfitting</li>
              <li>Ethical Considerations in ML</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quiz Questions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <h3 className="font-medium mb-2">What is the main difference between supervised and unsupervised learning?</h3>
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <div className="h-5 w-5 rounded-full border border-explainly-blue flex-shrink-0 mt-0.5"></div>
                    <p className="text-sm">Supervised learning requires human supervision, while unsupervised does not</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="h-5 w-5 rounded-full border border-explainly-blue bg-explainly-blue flex-shrink-0 mt-0.5"></div>
                    <p className="text-sm font-medium">Supervised learning uses labeled data, while unsupervised learning uses unlabeled data</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="h-5 w-5 rounded-full border border-explainly-blue flex-shrink-0 mt-0.5"></div>
                    <p className="text-sm">Supervised learning is used for prediction, while unsupervised is used for classification only</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-2">Which of the following is NOT a common evaluation metric for classification models?</h3>
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <div className="h-5 w-5 rounded-full border border-explainly-blue flex-shrink-0 mt-0.5"></div>
                    <p className="text-sm">Precision</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="h-5 w-5 rounded-full border border-explainly-blue flex-shrink-0 mt-0.5"></div>
                    <p className="text-sm">Recall</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="h-5 w-5 rounded-full border border-explainly-blue bg-explainly-blue flex-shrink-0 mt-0.5"></div>
                    <p className="text-sm font-medium">Mean Squared Error</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SummaryView;
