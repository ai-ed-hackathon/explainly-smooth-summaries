
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
import { toast } from "sonner";

const DashboardHeader: React.FC = () => {
  const handleUpload = () => {
    toast.success("Upload functionality will be implemented soon");
  };

  const handleLogout = () => {
    toast.info("Logout functionality will be implemented with Supabase");
  };

  return (
    <header className="w-full py-3 px-4 border-b border-border flex items-center justify-between bg-white">
      <Logo />
      
      <div className="flex items-center gap-3">
        <Button 
          onClick={handleUpload}
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
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default DashboardHeader;
