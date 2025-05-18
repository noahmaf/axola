import { IoFootsteps } from "react-icons/io5";
import { BiLogOutCircle, BiSolidInbox, BiTrendingUp } from "react-icons/bi";
import { PiStudentBold } from "react-icons/pi";
import { FaRegFolderOpen } from "react-icons/fa";
import SecondaryLogo from "@/assets/images/secondary-logo.png";
import { useSidebar } from "@/app/context/sidebarContext";
import logo from "@/assets/images/primary-logo-a.png";
import SidebarButton from "@/components/SidebarButton";
import SidebarItem from "@/components/SidebarItem";
import { useAuth } from "@/app/context/authContext";
import { Menu } from "lucide-react";
import { useSupportChats } from "@/features/support/context/supportContext";

const Sidebar = () => {
  const { isExpanded, setIsExpanded } = useSidebar();
  const { logout } = useAuth();
  const { chats } = useSupportChats();

  function handleLogOut() {
    logout();
  }

  const handleExpandSidebar = () => {
    setIsExpanded({ expanded: true });
  };

  return (
    <div
      className={`bg-white shadow-lg hidden sm:flex flex-col ${
        isExpanded ? "w-[260px]" : "w-[80px]"
      } h-screen sticky top-0 left-0 z-20 py-3 transition-all duration-300 ease-in-out`}
    >
      <div
        className={`flex items-center ${!isExpanded && "justify-center"} px-3`}
      >
        <div
          className={` ${
            !isExpanded ? "block" : "hidden"
          } ml-2 mt-1  h-12 w-12  flex items-center justify-center select-none`}
        >
          <img src={logo} className="h-8 w-8" />
        </div>

        <div
          className={` ${
            isExpanded ? "block" : "hidden"
          } justify-center ml-2 mt-1`}
        >
          <img src={SecondaryLogo} className="h-10 object-contain" />
        </div>
      </div>

      {/* Sidebar Items */}
      <div className="flex flex-col h-full ">
        <div className="mt-[40px]">
          {!isExpanded && (
            <div className="flex gap-2 mt-2 mx-4 group cursor-pointer items-center ">
              <Menu
                className="text-gray-500 h-11 w-11 cursor-pointer rounded-md hover:bg-gray-400 hover:bg-opacity-15 p-2"
                onClick={handleExpandSidebar}
              />
            </div>
          )}

          <SidebarItem
            title="Announcements"
            path="/announcements"
            index={true}
            icon={FaRegFolderOpen}
          />
          <SidebarItem title="Step-Ins" path="/step-ins" icon={IoFootsteps} />
          <SidebarItem
            title="Support"
            path="/support"
            icon={BiSolidInbox}
            badge={
              chats.filter(
                (chat) =>
                  !chat.latestMessage.read &&
                  chat.latestMessage.student !== null
              ).length !== 0
                ? chats
                    .filter(
                      (chat) =>
                        !chat.latestMessage.read &&
                        chat.latestMessage.student !== null
                    )
                    .length.toString()
                : undefined
            }
          />
          <SidebarItem title="Students" path="/students" icon={PiStudentBold} />
          <SidebarItem title="Reports" path="/reports" icon={BiTrendingUp} />
          <SidebarButton
            title="Log out"
            onClick={handleLogOut}
            textColor="text-red-500"
            backgroundColor="bg-red-500"
            icon={BiLogOutCircle}
          />
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
