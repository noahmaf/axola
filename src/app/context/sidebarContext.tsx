import { createContext, ReactNode, useContext, useState } from "react";

type SidebarContextType = {
  isExpanded: boolean;
  setIsExpanded: ({ expanded }: { expanded: boolean }) => void;
};

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export const SidebarProvider = ({ children }: { children: ReactNode }) => {
  const [sidebarExpanded, setSidebarExpanded] = useState(false);

  const setIsExpanded = ({ expanded }: { expanded: boolean }) => {
    setSidebarExpanded(expanded);
  };

  return (
    <SidebarContext.Provider
      value={{ isExpanded: sidebarExpanded, setIsExpanded: setIsExpanded }}
    >
      {children}
    </SidebarContext.Provider>
  );
};

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context)
    throw new Error("useSidebar must be used within a SidebarProvider");

  return context;
};
