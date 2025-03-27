
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Logo from "./Logo";

interface NavbarProps {
  showAuth?: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ showAuth = true }) => {
  return (
    <header className="w-full py-4 px-6 flex items-center justify-between border-b border-border">
      <Logo />
      
      {showAuth && (
        <div className="flex items-center gap-4">
          <Link to="/login">
            <Button variant="ghost" className="font-medium text-explainly-navy">
              Log in
            </Button>
          </Link>
          <Link to="/signup">
            <Button className="font-medium explainly-gradient-bg">
              Sign up
            </Button>
          </Link>
        </div>
      )}
    </header>
  );
};

export default Navbar;
