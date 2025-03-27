
import React, { useEffect, useState } from "react";
import { CalendarIcon, FileTextIcon, HomeIcon, SettingsIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Link, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

interface Transcript {
  id: string;
  title: string;
  created_at: string;
}

interface SidebarItemProps {
  icon: React.ElementType;
  label: string;
  to: string;
  active?: boolean;
}

const SidebarItem: React.FC<SidebarItemProps> = ({
  icon: Icon,
  label,
  to,
  active,
}) => {
  return (
    <Link 
      to={to}
      className={cn(
        "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
        active 
          ? "bg-explainly-blue/10 text-explainly-blue" 
          : "text-explainly-text-gray hover:bg-explainly-light-gray"
      )}
    >
      <Icon className="h-4 w-4" />
      <span>{label}</span>
    </Link>
  );
};

interface TranscriptItemProps {
  id: string;
  title: string;
  date: string;
  active?: boolean;
}

const TranscriptItem: React.FC<TranscriptItemProps> = ({
  id,
  title,
  date,
  active,
}) => {
  return (
    <Link 
      to={`/dashboard/summary/${id}`}
      className={cn(
        "px-3 py-2 rounded-lg cursor-pointer transition-colors block",
        active 
          ? "bg-explainly-blue/10" 
          : "hover:bg-explainly-light-gray"
      )}
    >
      <div className={cn(
        "font-medium truncate",
        active ? "text-explainly-blue" : "text-foreground"
      )}>
        {title}
      </div>
      <div className="text-xs text-explainly-text-gray">{date}</div>
    </Link>
  );
};

const Sidebar: React.FC = () => {
  const location = useLocation();
  const path = location.pathname;
  const [transcripts, setTranscripts] = useState<Transcript[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Extract transcript ID from path if we're on a summary page
  const currentTranscriptId = path.startsWith('/dashboard/summary/') 
    ? path.split('/').pop() 
    : null;

  useEffect(() => {
    const fetchTranscripts = async () => {
      try {
        const { data, error } = await supabase
          .from('transcripts')
          .select('id, title, created_at')
          .order('created_at', { ascending: false });
          
        if (error) throw error;
        
        setTranscripts(data || []);
      } catch (error) {
        console.error('Error fetching transcripts:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTranscripts();
    
    // Subscribe to changes in the transcripts table
    const channel = supabase
      .channel('transcripts-changes')
      .on('postgres_changes', 
          { event: '*', schema: 'public', table: 'transcripts' }, 
          () => {
            fetchTranscripts();
          })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM d, yyyy');
    } catch {
      return dateString;
    }
  };

  return (
    <div className="w-64 h-full border-r border-border bg-white flex flex-col">
      <div className="p-4">
        <div className="space-y-1">
          <SidebarItem
            icon={HomeIcon}
            label="Dashboard"
            to="/dashboard"
            active={path === "/dashboard"}
          />
          <SidebarItem
            icon={CalendarIcon}
            label="Recent"
            to="/dashboard/recent"
            active={path === "/dashboard/recent"}
          />
          <SidebarItem
            icon={SettingsIcon}
            label="Settings"
            to="/dashboard/settings"
            active={path === "/dashboard/settings"}
          />
        </div>
      </div>
      
      <div className="mt-6 px-4 flex-1 overflow-auto">
        <h3 className="text-xs font-semibold text-explainly-text-gray uppercase tracking-wider mb-2">
          My Transcripts
        </h3>
        <div className="space-y-1">
          {isLoading ? (
            <div className="flex justify-center py-4">
              <div className="animate-spin w-4 h-4 border-2 border-t-explainly-blue border-r-transparent border-b-explainly-blue border-l-transparent rounded-full"></div>
            </div>
          ) : transcripts.length > 0 ? (
            transcripts.map((transcript) => (
              <TranscriptItem
                key={transcript.id}
                id={transcript.id}
                title={transcript.title}
                date={formatDate(transcript.created_at)}
                active={transcript.id === currentTranscriptId}
              />
            ))
          ) : (
            <div className="py-3 px-3 text-sm text-explainly-text-gray">
              No transcripts yet. Upload one to get started!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
