import React from "react";
import { useSidebar } from "@/app/context/sidebarContext";

const SidebarButton = ({
  title,
  onClick,
  textColor,
  backgroundColor,
  icon: Icon,
}: {
  title: string;
  onClick: () => void;
  textColor: string;
  backgroundColor: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}) => {
  const { isExpanded: isSidebarExpanded } = useSidebar();

  return (
    <div
      className={`flex gap-2 mt-2 mx-4 group cursor-pointer items-center  ${
        isSidebarExpanded ? "justify-start" : "justify-center"
      } ${textColor} text-md font-medium  hover:${backgroundColor} hover:bg-opacity-15 py-3 px-1.5 rounded-md transition-all duration-300 ease-in-out`}
      onClick={onClick}
    >
      <Icon className={`h-6 w-6 ${textColor} group-hover:${backgroundColor}`} />
      <p className={`select-none ${isSidebarExpanded ? "lg:block" : "hidden"}`}>
        {title}
      </p>
    </div>
  );
};

export default SidebarButton;
