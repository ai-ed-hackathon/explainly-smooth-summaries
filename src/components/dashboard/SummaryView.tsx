
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, Share2 } from "lucide-react";
import { toast } from "sonner";

interface QuizQuestion {
  question: string;
  correctAnswer: string;
  incorrectAnswers: string[];
}

interface SummaryViewProps {
  title: string;
  summaryContent: string;
  exercises: string[];
  quizQuestions: QuizQuestion[];
}

const SummaryView: React.FC<SummaryViewProps> = ({ 
  title,
  summaryContent,
  exercises,
  quizQuestions
}) => {
  const handleDownload = () => {
    toast.success("Download functionality will be implemented soon");
  };

  const handleShare = () => {
    toast.success("Share functionality will be implemented soon");
  };

  // Split summary content into paragraphs if it's a string
  const summaryParagraphs = typeof summaryContent === 'string' 
    ? summaryContent.split(/\n+/).filter(Boolean)
    : ["No summary content available"];

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
            {summaryParagraphs.map((paragraph, index) => (
              <p key={index} className={`text-explainly-text-gray ${index > 0 ? 'mt-4' : ''}`}>
                {paragraph}
              </p>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Exercises</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-5 space-y-2 text-explainly-text-gray">
              {exercises.length > 0 ? (
                exercises.map((exercise, index) => (
                  <li key={index}>{exercise}</li>
                ))
              ) : (
                <li>No exercises available</li>
              )}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quiz Questions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {quizQuestions.length > 0 ? (
                quizQuestions.map((quiz, quizIndex) => (
                  <div key={quizIndex}>
                    <h3 className="font-medium mb-2">{quiz.question}</h3>
                    <div className="space-y-2">
                      {/* Combine correct and incorrect answers and randomize */}
                      {[
                        { text: quiz.correctAnswer, isCorrect: true },
                        ...(quiz.incorrectAnswers || []).map(text => ({ text, isCorrect: false }))
                      ].map((answer, answerIndex) => (
                        <div key={answerIndex} className="flex items-start gap-2">
                          <div 
                            className={`h-5 w-5 rounded-full border border-explainly-blue ${answer.isCorrect ? 'bg-explainly-blue' : ''} flex-shrink-0 mt-0.5`}
                          ></div>
                          <p className={`text-sm ${answer.isCorrect ? 'font-medium' : ''}`}>
                            {answer.text}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-explainly-text-gray">No quiz questions available</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SummaryView;
