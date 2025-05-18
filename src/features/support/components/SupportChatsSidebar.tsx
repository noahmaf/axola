import SupportChatsSidebarChatCard, {
  SupportChatsSidebarChatCardSkeleton,
} from "./SupportChatsSidebarChatCard";
import SupportChatsSidebarHeader, {
  SupportChatsSidebarHeaderSkeleton,
} from "./SupportChatsSidebarHeader";
import { useSupportChats } from "../context/supportContext";

const SupportChatsSidebar = () => {
  const { chats, selectedChat, chatFilter, chatsLoading } = useSupportChats();

  return (
    <div
      className={`${
        selectedChat ? "lg:flex hidden" : ""
      }  pb-1 shadow-md w-full lg:w-[40%] bg-slate-100   border-r border-gray-300  h-full flex flex-col`}
    >
      {chatsLoading ? (
        <SupportChatsSidebarHeaderSkeleton />
      ) : (
        <SupportChatsSidebarHeader title="Support Inbox" />
      )}

      {chatsLoading ? (
        <div className="space-y-[2px] pb-4 pt-1  flex-1 ">
          <SupportChatsSidebarChatCardSkeleton />
          <SupportChatsSidebarChatCardSkeleton />
          <SupportChatsSidebarChatCardSkeleton />
          <SupportChatsSidebarChatCardSkeleton />
          <SupportChatsSidebarChatCardSkeleton />
          <SupportChatsSidebarChatCardSkeleton />
          <SupportChatsSidebarChatCardSkeleton />
          <SupportChatsSidebarChatCardSkeleton />
          <SupportChatsSidebarChatCardSkeleton />
        </div>
      ) : chats.filter((chat) => {
          return chat.status === chatFilter;
        }).length !== 0 ? (
        <div className="space-y-[2px] pb-4 pt-1 overflow-y-auto flex-1 ">
          {chats
            .filter((chat) => {
              return chat.status === chatFilter;
            })
            .sort((chatA, chatB) => {
              const dateA = chatA.latestMessage?.dateCreated
                ? new Date(chatA.latestMessage.dateCreated).getTime()
                : 0;
              const dateB = chatB.latestMessage?.dateCreated
                ? new Date(chatB.latestMessage.dateCreated).getTime()
                : 0;

              return dateB - dateA;
            })
            .map((chat) => (
              <SupportChatsSidebarChatCard key={chat.id} chat={chat} />
            ))}
        </div>
      ) : (
        <div className="space-y-[12px] flex flex-col p-12 text-center  flex-1 bg-white text-gray-500 justify-center items-center">
          <p>
            All{" "}
            <span className="font-semibold text-secondary">{chatFilter}</span>{" "}
            support chats will appear here.
          </p>
        </div>
      )}
    </div>
  );
};

export default SupportChatsSidebar;
