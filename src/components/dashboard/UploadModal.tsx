
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from "uuid";

interface UploadModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUploadSuccess: () => void;
}

const UploadModal: React.FC<UploadModalProps> = ({ 
  open, 
  onOpenChange,
  onUploadSuccess 
}) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  // Modified to handle different file types appropriately
  const readFileContent = async (file: File): Promise<string> => {
    // If it's a text file, read as text
    if (file.type === 'text/plain') {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (event) => resolve(event.target?.result as string);
        reader.onerror = (error) => reject(error);
        reader.readAsText(file);
      });
    } 
    // For non-text files, we don't try to read the content as text
    // Instead, return a placeholder message
    else {
      return `[Binary content of type ${file.type}]`;
    }
  };

  const triggerN8NWorkflow = async (filePath: string) => {
    try {
      const response = await fetch("https://almanakmap.app.n8n.cloud/webhook/833efd65-7a27-48ca-8628-cb0e16c68e46", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ file_path: filePath }),
      });
      
      if (!response.ok) {
        throw new Error(`N8N webhook failed with status: ${response.status}`);
      }
      
      console.log("N8N workflow triggered successfully");
      return true;
    } catch (error) {
      console.error("Failed to trigger N8N workflow:", error);
      throw error;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !user) {
      toast.error("Please select a file to upload");
      return;
    }

    setIsUploading(true);
    
    try {
      // 1. Generate a unique file path
      const fileExt = file.name.split('.').pop();
      const fileName = `${uuidv4()}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;
      
      // 2. Upload file to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('transcript_files')
        .upload(filePath, file);
        
      if (uploadError) throw uploadError;
      
      // 3. Read content if it's a text file, otherwise use placeholder
      let content = "";
      try {
        content = await readFileContent(file);
      } catch (error) {
        console.warn("Could not read file content:", error);
        content = `[Content of ${file.name} couldn't be processed for preview]`;
      }
      
      // 4. Create transcript record in database
      const { data: transcriptData, error: dbError } = await supabase
        .from('transcripts')
        .insert({
          title,
          content,
          user_id: user.id,
          file_path: filePath,
          file_type: file.type,
          file_size: file.size,
          status: 'pending' // Set as pending since processing will happen in N8N
        })
        .select()
        .single();
        
      if (dbError) throw dbError;
      
      // 5. Trigger N8N workflow with the file path
      await triggerN8NWorkflow(filePath);
      
      toast.success("Transcript uploaded and processing initiated");
      onUploadSuccess();
      onOpenChange(false);
      setFile(null);
      setTitle("");
      
      // Redirect to the new transcript's summary page
      navigate(`/dashboard/summary/${transcriptData.id}`);
    } catch (error: any) {
      console.error('Upload error:', error);
      toast.error(error.message || "Failed to upload transcript");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Upload Transcript</DialogTitle>
          <DialogDescription>
            Upload a transcript file to generate AI-powered summaries and quiz questions.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                placeholder="Enter a title for this transcript"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="file">Transcript File</Label>
              <div className="border-2 border-dashed border-input rounded-lg p-6 flex flex-col items-center justify-center">
                <Upload className="h-8 w-8 text-explainly-text-gray mb-2" />
                <p className="text-sm text-explainly-text-gray mb-2">
                  {file ? file.name : "Drag and drop or click to upload"}
                </p>
                <Input
                  id="file"
                  type="file"
                  accept=".txt,.pdf,.doc,.docx"
                  className="hidden"
                  onChange={handleFileChange}
                  required
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => document.getElementById("file")?.click()}
                >
                  Select File
                </Button>
              </div>
              <p className="text-xs text-explainly-text-gray">
                Supports .txt, .pdf, .doc, and .docx files up to 10MB
              </p>
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              disabled={isUploading}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="explainly-gradient-bg"
              disabled={isUploading}
            >
              {isUploading ? "Uploading..." : "Upload"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UploadModal;
