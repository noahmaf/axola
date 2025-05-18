import { IoChevronBack } from "react-icons/io5";
import { useSupportChats } from "../context/supportContext";

const SupportChatAreaHeader = () => {
  const { selectedChat, setIsStudentInfoPaneOpen, selectChat } =
    useSupportChats();

  return (
    <div className="flex items-center bg-white">
      <div
        className="hover:bg-gray-100 h-12 w-12 rounded-full lg:hidden flex items-center justify-center cursor-pointer "
        onClick={() => {
          selectChat(undefined);
        }}
      >
        <IoChevronBack className="h-6 w-6 text-slate-500 " />
      </div>
      <div
        onClick={() => setIsStudentInfoPaneOpen(true)}
        className="cursor-pointer bg-white w-full hover:bg-pageBackground text-black p-2 flex items-center justify-between shadow-sm"
      >
        <div className="flex space-x-4">
          <div className="h-14 w-14 rounded-full bg-secondary text-white flex items-center justify-center">
            {selectedChat?.user.profilePicture ? (
              <img
                className="h-14 w-14 rounded-full"
                src={selectedChat.user.profilePicture}
              />
            ) : (
              selectedChat!.user.name.charAt(0) +
              selectedChat!.user.surname.charAt(0)
            )}
          </div>
          <div className="text-lg items-center">
            <p>{selectedChat?.user.name}</p>
            <p className="text-gray-500 text-sm italic">
              Click here to view student info
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupportChatAreaHeader;

export const SupportChatAreaHeaderSkeleton = () => {
  return (
    <div className="flex items-center bg-white select-none w-full p-2 space-x-4">
      <div className="h-14 w-14 rounded-full shrink-0 bg-secondary bg-opacity-20 text-transparent flex items-center justify-center">
        _
      </div>
      <div className="flex flex-col w-full space-y-1 ">
        <p className="bg-secondary bg-opacity-20  w-[25%] rounded-md">_</p>
        <p className="bg-secondary bg-opacity-20 w-[55%] rounded-md">_</p>
      </div>
    </div>
  );
};
