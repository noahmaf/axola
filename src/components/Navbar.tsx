import { useAuth } from "@/app/context/authContext";
import { useSidebar } from "@/app/context/sidebarContext";
import { ChevronDown, Sidebar } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import userService from "@/app/services/userService";
import { useSupportChats } from "@/features/support/context/supportContext";

const Navbar = () => {
  const { isExpanded, setIsExpanded } = useSidebar();
  const { user, refreshSession } = useAuth();
  const { selectChat } = useSupportChats();

  const handleCollapseSidebar = () => {
    setIsExpanded({ expanded: !isExpanded });
  };

  const switchProgram = async (newProgram: string) => {
    if (user) {
      try {
        await userService.switchProgram({ userId: user?.id, newProgram });
        selectChat(undefined);
        await refreshSession();
      } catch (error) {}
    }
  };

  return (
    <div
      className={`left-0  top-0 z-20 shadow-sm  h-[80px] sticky flex items-center w-full  transition-all duration-300 ease-in-out`}
    >
      <div className="h-full w-full  p-2 flex items-center bg-white select-none">
        <div className="h-full w-full  p-2 flex items-center  justify-between">
          <div className="flex w-full items-center space-x-2">
            {isExpanded && (
              <div className="text-gray-400 h-12 w-12 cursor-pointer rounded-full hover:bg-gray-400 hover:bg-opacity-20 p-2">
                <Sidebar className="h-7 w-7" onClick={handleCollapseSidebar} />
              </div>
            )}
            <div className=" px-2 w-full items-start flex flex-col">
              {user?.programs && user?.programs.length < 2 && (
                <p className="text-secondary font-semibold">
                  {user?.currentProgram?.name}
                </p>
              )}

              {user?.programs && user?.programs.length > 1 && (
                <DropdownMenu>
                  <DropdownMenuTrigger
                    asChild
                    className="cursor-pointer border px-4 py-2 rounded-lg border-secondary-50"
                  >
                    <div className="text-secondary font-semibold flex items-center space-x-4">
                      <p>{user?.currentProgram?.name}</p>
                      <ChevronDown className="h-6 w-6" />
                    </div>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="flex flex-col px-4 w-full left-0">
                    <DropdownMenuLabel>Current Program</DropdownMenuLabel>
                    <DropdownMenuSeparator />

                    {user.programs.map((program) => {
                      const selected = program.id === user.currentProgram?.id;
                      return (
                        <DropdownMenuCheckboxItem
                          key={program.id}
                          className={`${
                            selected ? "text-secondary" : ""
                          } cursor-pointer `}
                          checked={selected}
                          onCheckedChange={() => {
                            switchProgram(program.id);
                          }}
                        >
                          {program.name}
                        </DropdownMenuCheckboxItem>
                      );
                    })}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </div>

          {user && (
            <div className=" w-full h-full justify-end flex space-x-4 items-center select-none">
              <div className="flex flex-col h-full items-end justify-center py-12">
                <p className="font-semibold text-lg text-gray-500">{`${user.name} ${user.surname}`}</p>
                <p className="text-base text-secondary font-semibold">{`${
                  user.owner ? "Axola Administrator" : "Program Administrator"
                } `}</p>
              </div>
              <div className="h-14 w-14 text-xl font-medium shrink-0 rounded-full bg-secondary flex items-center justify-center">
                {user.profilePicture ? (
                  <img
                    className="h-12 w-12 rounded-full items-center justify-center"
                    src={user.profilePicture}
                  />
                ) : (
                  user.name.charAt(0) + user.surname.charAt(0)
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
