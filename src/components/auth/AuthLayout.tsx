
import React from "react";
import Logo from "../Logo";
import { Link } from "react-router-dom";

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
  footerText: string;
  footerLinkText: string;
  footerLinkUrl: string;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({
  children,
  title,
  subtitle,
  footerText,
  footerLinkText,
  footerLinkUrl,
}) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-explainly-light-gray px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Logo size="large" />
        </div>
        
        <div className="bg-white rounded-xl shadow-card p-8">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold">{title}</h1>
            <p className="text-explainly-text-gray mt-2">{subtitle}</p>
          </div>
          
          {children}
          
          <div className="mt-6 text-center text-sm text-explainly-text-gray">
            {footerText}{" "}
            <Link to={footerLinkUrl} className="text-explainly-blue font-medium hover:underline">
              {footerLinkText}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
