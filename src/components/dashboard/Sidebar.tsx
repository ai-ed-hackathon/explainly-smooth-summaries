
import React from "react";
import { CalendarIcon, FileTextIcon, HomeIcon, SettingsIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Link, useLocation } from "react-router-dom";

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
  title: string;
  date: string;
  active?: boolean;
}

const TranscriptItem: React.FC<TranscriptItemProps> = ({
  title,
  date,
  active,
}) => {
  return (
    <div className={cn(
      "px-3 py-2 rounded-lg cursor-pointer transition-colors",
      active 
        ? "bg-explainly-blue/10" 
        : "hover:bg-explainly-light-gray"
    )}>
      <div className={cn(
        "font-medium truncate",
        active ? "text-explainly-blue" : "text-foreground"
      )}>
        {title}
      </div>
      <div className="text-xs text-explainly-text-gray">{date}</div>
    </div>
  );
};

const Sidebar: React.FC = () => {
  const location = useLocation();
  const path = location.pathname;

  const transcripts = [
    { id: 1, title: "Introduction to Machine Learning", date: "May 15, 2023" },
    { id: 2, title: "React Hooks Deep Dive", date: "May 10, 2023" },
    { id: 3, title: "Modern JavaScript Fundamentals", date: "May 5, 2023" },
    { id: 4, title: "Design Systems Workshop", date: "Apr 28, 2023" },
    { id: 5, title: "Product Management Basics", date: "Apr 20, 2023" },
  ];

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
      
      <div className="mt-6 px-4">
        <h3 className="text-xs font-semibold text-explainly-text-gray uppercase tracking-wider mb-2">
          My Transcripts
        </h3>
        <div className="space-y-1">
          {transcripts.map((transcript) => (
            <TranscriptItem
              key={transcript.id}
              title={transcript.title}
              date={transcript.date}
              active={transcript.id === 1}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
