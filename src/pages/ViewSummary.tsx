
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import Sidebar from "@/components/dashboard/Sidebar";
import SummaryView from "@/components/dashboard/SummaryView";
import UploadModal from "@/components/dashboard/UploadModal";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Trash2, Clock } from "lucide-react";
import { deleteTranscript } from "@/utils/transcriptUtils";
import { Progress } from "@/components/ui/progress";

type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

interface Transcript {
  id: string;
  title: string;
  content: string;
  file_path: string | null;
  created_at: string;
  status: string;
}

interface Summary {
  id: string;
  content: string;
  transcript_id: string;
  created_at: string;
}

interface Exercise {
  id: string;
  content: string;
  summary_id: string;
}

interface QuizQuestion {
  id: string;
  question: string;
  correctAnswer: string;
  incorrectAnswers: string[];
  summary_id: string;
}

const ViewSummary = () => {
  const { id } = useParams<{ id: string }>();
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [transcript, setTranscript] = useState<Transcript | null>(null);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [processingInterval, setProcessingIntervalState] = useState<number | null>(null);
  const navigate = useNavigate();

  const startProgressSimulation = () => {
    if (processingInterval) {
      window.clearInterval(processingInterval);
    }
    
    setProcessingProgress(0);
    
    const interval = window.setInterval(() => {
      setProcessingProgress(prev => {
        const increment = prev < 50 ? 2 : prev < 80 ? 1 : 0.5;
        const newProgress = Math.min(prev + increment, 95);
        return newProgress;
      });
    }, 3000);
    
    setProcessingIntervalState(interval);
  };

  const stopProgressSimulation = () => {
    if (processingInterval) {
      window.clearInterval(processingInterval);
      setProcessingIntervalState(null);
    }
    setProcessingProgress(100);
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      if (!id) return;

      const { data: transcriptData, error: transcriptError } = await supabase
        .from('transcripts')
        .select('*')
        .eq('id', id)
        .single();
        
      if (transcriptError) throw transcriptError;
      setTranscript(transcriptData);

      if (transcriptData.status === 'pending') {
        startProgressSimulation();
      }

      const { data: summaryData, error: summaryError } = await supabase
        .from('summaries')
        .select('*')
        .eq('transcript_id', id)
        .single();
        
      if (summaryError && summaryError.code !== 'PGRST116') throw summaryError;
      
      if (summaryData) {
        setSummary(summaryData);
        stopProgressSimulation();
        
        const { data: exercisesData, error: exercisesError } = await supabase
          .from('key_concepts')
          .select('*')
          .eq('summary_id', summaryData.id);
          
        if (exercisesError) throw exercisesError;
        setExercises(exercisesData || []);

        const { data: quizData, error: quizError } = await supabase
          .from('quiz_questions')
          .select('*')
          .eq('summary_id', summaryData.id);
          
        if (quizError) throw quizError;
        
        if (quizData) {
          const formattedQuizQuestions: QuizQuestion[] = quizData.map(q => ({
            id: q.id,
            question: q.question,
            correctAnswer: q.correct_answer,
            incorrectAnswers: Array.isArray(q.incorrect_answers) 
              ? q.incorrect_answers as string[] 
              : typeof q.incorrect_answers === 'object' 
                ? Object.values(q.incorrect_answers as object) as string[]
                : [q.incorrect_answers as string],
            summary_id: q.summary_id
          }));
          
          setQuizQuestions(formattedQuizQuestions);
        }
      } else {
        setSummary(null);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    
    // Only set up the refresh interval if we're still in 'pending' state
    let refreshInterval: number | null = null;
    
    if (transcript?.status === 'pending' && !summary) {
      refreshInterval = window.setInterval(() => {
        fetchData();
      }, 30000); // Check every 30 seconds
    }
    
    return () => {
      if (refreshInterval) {
        window.clearInterval(refreshInterval);
      }
      if (processingInterval) {
        window.clearInterval(processingInterval);
      }
    };
  // Only re-run this effect when the ID changes or when summary state changes
  }, [id]);

  const createDummySummary = async (transcript: Transcript) => {
    try {
      const { data: summaryData, error: summaryError } = await supabase
        .from('summaries')
        .insert({
          transcript_id: transcript.id,
          content: `This is an auto-generated summary of "${transcript.title}". In a real implementation, this would be generated by an AI model based on the transcript content.`,
        })
        .select()
        .single();
        
      if (summaryError) throw summaryError;
      setSummary(summaryData);
      
      await supabase
        .from('key_concepts')
        .insert([
          { summary_id: summaryData.id, content: "Exercise 1: Explain the main principle discussed in the lecture" },
          { summary_id: summaryData.id, content: "Exercise 2: Compare and contrast two key ideas from the transcript" },
          { summary_id: summaryData.id, content: "Exercise 3: Apply the concepts to a real-world scenario" },
        ]);
        
      await supabase
        .from('quiz_questions')
        .insert({
          summary_id: summaryData.id,
          question: "What is the main topic of this lecture?",
          correct_answer: "The main topic",
          incorrect_answers: ["Wrong answer 1", "Wrong answer 2", "Wrong answer 3"],
        });
        
      toast.success("Summary generated");
      
      fetchData();
    } catch (error) {
      console.error('Error creating dummy data:', error);
      toast.error("Failed to generate summary");
    }
  };

  const handleDeleteTranscript = async () => {
    if (!transcript) return;
    
    const success = await deleteTranscript(transcript.id, transcript.file_path);
    if (success) {
      toast.success("Transcript deleted successfully");
      navigate("/dashboard");
    }
  };

  return (
    <div className="flex h-screen flex-col">
      <DashboardHeader onUploadClick={() => setIsUploadModalOpen(true)} />
      
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        
        <div className="flex-1 overflow-auto">
          {loading ? (
            <div className="flex h-full items-center justify-center">
              <div className="animate-spin h-8 w-8 border-4 border-explainly-blue border-t-transparent rounded-full"></div>
            </div>
          ) : transcript ? (
            <div className="h-full flex flex-col">
              <div className="border-b border-border">
                <div className="flex items-center justify-between p-4">
                  <h1 className="text-2xl font-bold">{transcript.title}</h1>
                  <div className="flex items-center gap-2">
                    {!summary && transcript.status !== 'pending' && (
                      <Button 
                        onClick={() => createDummySummary(transcript)}
                        className="explainly-gradient-bg"
                      >
                        Generate Summary
                      </Button>
                    )}
                    
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" size="icon">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Transcript</AlertDialogTitle>
                          <AlertDialogDescription>
                            This will permanently delete this transcript, its summary, exercises, and quiz questions. This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={handleDeleteTranscript}>
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </div>
              
              {summary ? (
                <SummaryView 
                  title={transcript.title}
                  summaryContent={summary.content}
                  exercises={exercises.map(ex => ex.content)}
                  quizQuestions={quizQuestions}
                />
              ) : transcript.status === 'pending' ? (
                <div className="flex flex-col items-center justify-center h-full p-6">
                  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 max-w-md w-full">
                    <div className="flex items-center justify-center mb-4">
                      <Clock className="h-12 w-12 text-explainly-blue animate-pulse" />
                    </div>
                    <h2 className="text-xl font-semibold text-center mb-4">Processing Your Transcript</h2>
                    <p className="text-explainly-text-gray text-center mb-6">
                      We're analyzing your transcript to generate a summary, exercises, and quiz questions. This typically takes about 2 minutes.
                    </p>
                    <div className="space-y-2">
                      <Progress value={processingProgress} className="h-2" />
                      <p className="text-sm text-explainly-text-gray text-center">
                        {processingProgress < 100 ? 'Processing...' : 'Almost done!'}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full p-6">
                  <h2 className="text-xl font-semibold mb-4">No Summary Generated Yet</h2>
                  <p className="text-explainly-text-gray mb-6">
                    This transcript doesn't have a summary yet. Click the button above to generate one.
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full">
              <h2 className="text-xl font-semibold mb-4">Transcript Not Found</h2>
              <p className="text-explainly-text-gray mb-6">
                The transcript you're looking for doesn't exist or you don't have permission to view it.
              </p>
              <Button onClick={() => navigate("/dashboard")}>
                Back to Dashboard
              </Button>
            </div>
          )}
        </div>
      </div>
      
      <UploadModal 
        open={isUploadModalOpen} 
        onOpenChange={setIsUploadModalOpen}
        onUploadSuccess={fetchData}
      />
    </div>
  );
};

export default ViewSummary;
