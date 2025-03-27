
import React, { useState } from "react";
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
  const { user } = useAuth();
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const readFileContent = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => resolve(event.target?.result as string);
      reader.onerror = (error) => reject(error);
      reader.readAsText(file);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !user) {
      toast.error("Please select a file to upload");
      return;
    }

    setIsUploading(true);
    
    try {
      // 1. Read file content
      const content = await readFileContent(file);
      
      // 2. Generate a unique file path
      const fileExt = file.name.split('.').pop();
      const fileName = `${uuidv4()}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;
      
      // 3. Upload file to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('transcript_files')
        .upload(filePath, file);
        
      if (uploadError) throw uploadError;
      
      // 4. Create transcript record in database
      const { error: dbError } = await supabase
        .from('transcripts')
        .insert({
          title,
          content,
          user_id: user.id,
          file_path: filePath,
          file_type: file.type,
          file_size: file.size,
          status: 'completed' // For simplicity, setting as completed immediately
        });
        
      if (dbError) throw dbError;
      
      toast.success("Transcript uploaded successfully");
      onUploadSuccess();
      onOpenChange(false);
      setFile(null);
      setTitle("");
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
