
import React from "react";
import { Button } from "@/components/ui/button";
import { Plus, User } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Logo from "../Logo";
import { useAuth } from "@/contexts/AuthContext";

interface DashboardHeaderProps {
  onUploadClick: () => void;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ onUploadClick }) => {
  const { signOut, user } = useAuth();

  return (
    <header className="w-full py-3 px-4 border-b border-border flex items-center justify-between bg-white">
      <Logo />
      
      <div className="flex items-center gap-3">
        <Button 
          onClick={onUploadClick}
          className="explainly-gradient-bg"
          size="sm"
        >
          <Plus className="h-4 w-4 mr-2" />
          Upload Transcript
        </Button>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <User className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-xs text-gray-500 py-2">
              {user?.email}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => signOut()}>
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default DashboardHeader;
