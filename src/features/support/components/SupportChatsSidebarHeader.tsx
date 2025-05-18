import { useState } from "react";
import { IoMdClose, IoMdSearch } from "react-icons/io";
import SupportChatsSidebarHeaderFilterButton, {
  SupportChatsSidebarHeaderFilterButtonSkeleton,
} from "./SupportChatsSidebarHeaderFilterButton";
import { useSupportChats } from "../context/supportContext";

const SupportChatsSidebarHeader = ({ title }: { title: string }) => {
  const filters = ["In Progress", "Pending Resolve", "Referred", "Resolved"];

  const [openSearch, setOpenSearch] = useState<boolean>(false);
  const { chatFilter, setChatFilter } = useSupportChats();

  return (
    <div className="sticky top-0 left-0 bg-white text-xl text-start font-semibold   text-black py-4 h-fit items-center flexflex-col  justify-start">
      <div className="pl-8 pr-4 space-y-3">
        <div className="flex justify-between w-full items-center">
          <p className="select-none">{title}</p>
          <div
            className="hover:bg-gray-100 text-gray-500 h-12 w-12 rounded-full flex items-center justify-center cursor-pointer "
            onClick={() => {
              setOpenSearch((prev) => !prev);
            }}
          >
            {!openSearch ? (
              <IoMdSearch className="h-7 w-7 cursor-pointer " />
            ) : (
              <IoMdClose className="h-6 w-6 cursor-pointer" />
            )}
          </div>
        </div>
        {openSearch && (
          <input
            type="text"
            name="search"
            id="search"
            placeholder="Search"
            className="block w-full search-input "
          />
        )}
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
