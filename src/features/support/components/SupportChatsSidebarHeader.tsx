
import SupportChatsSidebarHeaderFilterButton, {
  SupportChatsSidebarHeaderFilterButtonSkeleton,
} from "./SupportChatsSidebarHeaderFilterButton";
import { categoryFilters, useSupportChats } from "../context/supportContext";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";

const SupportChatsSidebarHeader = ({ title }: { title: string }) => {
  const filters = [
    "New",
    "In Progress",
    "Referred",
    "Pending Resolve",
    "Resolved",
  ];

  const { chatFilter, setChatFilter, chatCategoryFilter, setChatCategoryFilter } = useSupportChats();

  return (
    <div className="sticky top-0 left-0 bg-white text-xl text-start font-semibold   text-black py-4 h-fit items-center flexflex-col  justify-start">
      <div className="pl-8 pr-4 space-y-3">
        <div className="flex justify-between w-full items-center">
          <p className="select-none">{title}</p>
          {chatFilter === "New" && (
            <DropdownMenu>
              <DropdownMenuTrigger
                asChild
                className="cursor-pointer text-xs border px-4 py-2 rounded-lg border-gray-300"
              >
                <div className="text-gray-800 font-medium flex items-center space-x-4">
                  <p>{chatCategoryFilter}</p>
                  <ChevronDown className="h-4 w-4" />
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="flex flex-col px-4 w-full left-0">
                <DropdownMenuLabel>Support Case View</DropdownMenuLabel>
                <DropdownMenuSeparator />

                {categoryFilters.map((category, id) => {
                  const selected = category === chatCategoryFilter;
                  return (
                    <DropdownMenuCheckboxItem
                      key={id}
                      className={`${
                        selected ? "text-secondary" : ""
                      } cursor-pointer `}
                      checked={selected}
                      onCheckedChange={() => {
                        // switchProgram(program.id);
                        setChatCategoryFilter(category)
                      }}
                    >
                      {category}
                    </DropdownMenuCheckboxItem>
                  );
                })}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
      <div className="flex  h-fit  space-x-2 overflow-x-auto px-8 scrollbar-hidden pt-4 select-none">
        {filters.map((filter, index) => {
          return (
            <SupportChatsSidebarHeaderFilterButton
              key={index}
              onClick={(filter) => {
                setChatFilter(filter);
              }}
              activeFilter={chatFilter}
              filter={filter}
            />
          );
        })}
      </div>
    </div>
  );
};

export default SupportChatsSidebarHeader;

export const SupportChatsSidebarHeaderSkeleton = () => {
  return (
    <div className="sticky top-0 left-0 bg-white text-xl   text-transparent py-4 h-fit items-center flex flex-col  justify-start  animate-pulse">
      <div className="pl-8 pr-4 flex justify-between w-full space-x-2">
        <p className="select-none bg-secondary bg-opacity-20 rounded-md w-full">
          _
        </p>
        <div className="bg-secondary bg-opacity-20 w-7 h-7 rounded-md">
          _____
        </div>
      </div>
      <div className="flex  h-fit w-full space-x-2  px-8 scrollbar-hidden pt-4 select-none">
        <SupportChatsSidebarHeaderFilterButtonSkeleton />
        <SupportChatsSidebarHeaderFilterButtonSkeleton />
        <SupportChatsSidebarHeaderFilterButtonSkeleton />
      </div>
    </div>
  );
};
