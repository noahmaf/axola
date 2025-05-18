import { SupportChat } from "@/app/models/SupportChat";
import { useSupportChats } from "../context/supportContext";
import { formatChatTimestamp } from "@/app/utils/chatDateFormat";

const SupportChatsSidebarChatCard = ({ chat }: { chat: SupportChat }) => {
  const { selectChat } = useSupportChats();

  return (
    <div
      onClick={() => selectChat(chat)}
      className="bg-white shadow-sm py-4 pl-8 pr-4 cursor-pointer hover:bg-secondary hover:bg-opacity-5  flex h-fit items-center "
    >
      <div className="h-14 w-14 shrink-0 rounded-full bg-secondary flex items-center justify-center">
        {chat.user.profilePicture ? (
          <img
            className="h-14 w-14 rounded-full items-center justify-center"
            src={chat.user.profilePicture}
          />
        ) : (
          chat.user.name.charAt(0)
        )}
      </div>

      <div className="ml-4 flex flex-col items-start justify-center w-full ">
        <p className="font-semibold text-black">{`${chat.user.name} ${chat.user.surname}`}</p>
        <p
          className={`${
            chat.latestMessage.read === false &&
            chat.latestMessage.administrator === null
              ? "text-orange-500"
              : "text-gray-500"
          }
           text-base font-medium line-clamp-2`}
        >
          {chat.latestMessage.content}
        </p>
      </div>

      <div className="flex flex-col justify-center space-y-4 items-end">
        <p
          className={`${
            chat.latestMessage.read === false &&
            chat.latestMessage.administrator === null
              ? "text-orange-500"
              : "text-gray-500"
          }
           text-base font-medium`}
        >
          {formatChatTimestamp(chat.latestMessage.dateCreated)}
        </p>
        <div
          className={`${
            chat.category === "Accommodation"
              ? "bg-orange-500"
              : chat.category === "Academic"
              ? "bg-blue-500"
              : chat.category === "Financial"
              ? "bg-green-500"
              : chat.category === "Learning Resources"
              ? "bg-pink-500"
              : chat.category === "Registration"
              ? "bg-yellow-500"
              : chat.category === "General"
              ? "bg-purple-500"
              : ""
          } bg-opacity-10 px-4 w-[145px] py-1 rounded-full justify-center items-center text-center`}
        >
          <p
            className={`${
              chat.category === "Accommodation"
                ? "text-orange-500"
                : chat.category === "Academic"
                ? "text-blue-500"
                : chat.category === "Financial"
                ? "text-green-500"
                : chat.category === "Learning Resources"
                ? "text-pink-500"
                : chat.category === "Registration"
                ? "text-yellow-500"
                : chat.category === "General"
                ? "text-purple-500"
                : ""
            } text-sm font-semibold`}
          >
            {chat.category}
          </p>
        </div>
      </div>
    </div>
  );
};

export default SupportChatsSidebarChatCard;

export const SupportChatsSidebarChatCardSkeleton = () => {
  return (
    <div className="bg-white shadow-sm py-4 px-8  flex h-fit items-center select-none text-transparent animate-pulse">
      <div className="h-14 w-14 shrink-0 rounded-full bg-secondary bg-opacity-20 flex items-center justify-center">
        <div className="h-14 w-14 rounded-full items-center justify-center">
          _
        </div>
      </div>

      <div className="ml-4 flex flex-col items-start justify-center w-full space-y-1">
        <div className=" flex justify-between w-full">
          <p className="bg-secondary bg-opacity-20 rounded-md w-[45%]">_</p>
          <p className="bg-secondary bg-opacity-20 rounded-md w-[20%]">_</p>
        </div>
        <p className="bg-secondary bg-opacity-20 rounded-md w-full">_</p>
      </div>
    </div>
  );
};
