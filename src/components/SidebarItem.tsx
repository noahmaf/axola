import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import { useSidebar } from "@/app/context/sidebarContext";

const SidebarItem = ({
  title,
  path,
  index,

  badge,
  icon: Icon,
  subcategories,
}: {
  title: string;
  path: string;
  badge?: string;
  index?: boolean;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  subcategories?: {
    name: string;
    queryParam: string;
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  }[];
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const { isExpanded: isSidebarExpanded } = useSidebar();

  const isActive = (currentPath: string, queryParam?: string) => {
    const currentQuery = new URLSearchParams(location.search).get("status");

    if (queryParam) {
      return (
        location.pathname.startsWith(currentPath) && currentQuery === queryParam
      );
    }

    const isSubcategoryActive = subcategories?.some(
      (subcategory) =>
        location.pathname.startsWith(currentPath) &&
        currentQuery === subcategory.queryParam
    );

    return (
      (index === true &&
        path === "/announcements" &&
        location.pathname === "/") ||
      location.pathname.startsWith(currentPath) ||
      isSubcategoryActive
    );
  };

  const handleSidebarItemClick = () => {
    if (subcategories) {
      setIsExpanded(!isExpanded);
      navigate(`${path}?status=${subcategories[0].queryParam}`);
    } else if (location.pathname !== path) {
      navigate(path);
    }
  };

  return (
    <div>
      <div
        className={`flex gap-2 mt-2 mx-4 group cursor-pointer items-center  ${
          isSidebarExpanded ? "justify-start" : "justify-center"
        } ${
          isActive(path) ? "text-secondary" : "text-black"
        } text-md font-medium hover:text-secondary hover:bg-secondary hover:bg-opacity-15 py-3 px-1.5 rounded-md transition-all duration-300 ease-in-out`}
        onClick={handleSidebarItemClick}
      >
        <div className="relative">
          <Icon
            className={`h-6 w-6 ${
              isActive(path) ? "text-secondary" : "text-gray-500"
            } group-hover:text-secondary`}
          />
          {badge && (
            <div className="absolute -top-2 -right-2 bg-orange-500 text-white text-sm font-bold flex items-center justify-center rounded-full h-5 w-5">
              {badge}
            </div>
          )}
        </div>
        <p
          className={`group-hover:text-secondary font-medium ${
            isActive(path) ? "text-secondary " : "text-gray-500"
          } select-none ${isSidebarExpanded ? "lg:block" : "hidden"}`}
        >
          {title}
        </p>
        {subcategories && isSidebarExpanded && (
          <span className="ml-auto ">
            {isExpanded ? (
              <FiChevronUp
                className={`h-5 w-5 text-gray-500 group-hover:text-secondary ${
                  isActive(path) ? "text-secondary" : "text-gray-500"
                }`}
              />
            ) : (
              <FiChevronDown
                className={`h-5 w-5 text-gray-500 group-hover:text-secondary ${
                  isActive(path) ? "text-secondary" : "text-gray-500"
                }`}
              />
            )}
          </span>
        )}
      </div>

      {/* Subcategories */}
      {isExpanded && subcategories && isSidebarExpanded && (
        <div className="ml-[42px] mr-2 mt-2  flex-col gap-1 space-y-2 ">
          {/* Indented */}
          {subcategories.map((subcategory) => (
            <div
              key={subcategory.name}
              className={`flex items-center gap-2 cursor-pointer text-sm font-medium py-2 px-4 rounded-full ${
                isActive(path, subcategory.queryParam)
                  ? "bg-secondary text-white"
                  : "text-gray-600 hover:bg-secondary hover:bg-opacity-20 hover:text-secondary"
              }`}
              onClick={() =>
                navigate(`${path}?status=${subcategory.queryParam}`)
              }
            >
              <subcategory.icon
                className={`h-5 w-5 ${
                  isActive(path, subcategory.queryParam)
                    ? "text-white"
                    : "text-gray-500"
                }`}
              />

              <p className="select-none">{subcategory.name}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SidebarItem;
