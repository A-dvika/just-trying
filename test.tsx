// src/components/PageLayout.tsx
import React, { ReactNode } from "react";
import AppHeader from "./AppHeader";

interface PageLayoutProps {
  children: ReactNode;
}

const PageLayout: React.FC<PageLayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col h-screen">
      {/* your existing header/nav */}
      <AppHeader />

      {/* flex‐1 = take all remaining vertical space; overflow‐auto allows scrolling if content is too tall */}
      <main className="flex-1 overflow-auto bg-gray-50">
        {/* 
          max-w-screen-xl: cap width on very wide monitors 
          mx-auto: center horizontally 
          px-4 sm:px-6 lg:px-8: responsive side padding 
          py-6: top/bottom padding
        */}
        <div className="max-w-screen-xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6">
          {children}
        </div>
      </main>
    </div>
  );
};

export default PageLayout;
