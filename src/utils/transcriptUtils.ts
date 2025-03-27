
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

/**
 * Deletes a transcript and its associated files from Supabase
 * - Also cascades deletion to summaries, key concepts, and quiz questions through DB constraints
 */
export const deleteTranscript = async (
  transcriptId: string,
  filePath: string | null
): Promise<boolean> => {
  try {
    // Step 1: Delete the file from storage if it exists
    if (filePath) {
      const { error: storageError } = await supabase.storage
        .from('transcript_files')
        .remove([filePath]);
        
      if (storageError) {
        console.error('Storage deletion error:', storageError);
        // Continue anyway - we still want to delete the database record
      }
    }
    
    // Step 2: Delete the transcript from the database
    // This will cascade delete related summaries, key concepts, and quiz questions
    const { error: dbError } = await supabase
      .from('transcripts')
      .delete()
      .eq('id', transcriptId);
      
    if (dbError) throw dbError;
    
    toast.success("Transcript deleted successfully");
    return true;
  } catch (error) {
    console.error('Deletion error:', error);
    toast.error("Failed to delete transcript");
    return false;
  }
};
