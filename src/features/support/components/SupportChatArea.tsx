import SupportChatAreaFooter, {
  SupportChatAreaFooterSkeleton,
} from "./SupportChatAreaFooter";
import SupportChatAreaHeader, {
  SupportChatAreaHeaderSkeleton,
} from "./SupportChatAreaHeader";
import SupportChatAreaMessageCard, {
  SupportChatAreaMessageCardSkeleton,
} from "./SupportChatAreaMessageCard";
import SupportChatAreaStudentInformation from "./SupportChatAreaStudentInformation";
import { useSupportChats } from "../context/supportContext";
import { useEffect, useRef } from "react";
import BackgroundImage from "@/assets/images/chat_background.png";

const SupportChatArea = () => {
  const {
    chatsLoading,
    messagesLoading,
    selectedChat,
    currentChatMessages,
    isStudentInfoPaneOpen,
    chatFirstLoad,
    setChatFirstLoad,
  } = useSupportChats();

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({
        behavior: chatFirstLoad ? "auto" : "smooth",
      });
      setChatFirstLoad(false);
    }
  }, [currentChatMessages]);

  return (
    <div
      className={`relative  flex-1 ${
        selectedChat !== undefined ? "flex" : "lg:flex hidden"
      } flex-col bg-secondary bg-opacity-10`}
    >
      <div className="z-10">
        {/* Chat Header */}
        {messagesLoading ? (
          <SupportChatAreaHeaderSkeleton />
        ) : (
          selectedChat && <SupportChatAreaHeader />
        )}
      </div>
      {selectedChat && (
        <div
          className="absolute inset-0 space-y-4 p-4  opacity-10 "
          style={{
            backgroundImage: `url(${BackgroundImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            backgroundAttachment: "fixed",
            height: "100%",
          }}
        ></div>
      )}

      {/* Chat Messages */}
      {messagesLoading ? (
        <div className="flex-1 overflow-y-auto ">
          <div className=" space-y-4 p-4">
            <SupportChatAreaMessageCardSkeleton sent={true} />
            <SupportChatAreaMessageCardSkeleton sent={false} />
            <SupportChatAreaMessageCardSkeleton sent={true} />
            <SupportChatAreaMessageCardSkeleton sent={false} />
            <SupportChatAreaMessageCardSkeleton sent={true} />
            <SupportChatAreaMessageCardSkeleton sent={false} />
            <SupportChatAreaMessageCardSkeleton sent={true} />
            <SupportChatAreaMessageCardSkeleton sent={false} />
            <SupportChatAreaMessageCardSkeleton sent={true} />
            <SupportChatAreaMessageCardSkeleton sent={false} />
            <SupportChatAreaMessageCardSkeleton sent={true} />
            <SupportChatAreaMessageCardSkeleton sent={false} />
            <SupportChatAreaMessageCardSkeleton sent={true} />
          </div>
        </div>
      ) : selectedChat ? (
        <div className="flex-1 overflow-y-auto ">
          <div className="relative space-y-4 p-4 z-10">
            {currentChatMessages.map((message, index) => (
              <SupportChatAreaMessageCard key={index} chatMessage={message} />
            ))}

            <div ref={messagesEndRef} />
          </div>
        </div>
      ) : (
        !chatsLoading && (
          <div className="flex text-center text-gray-500 items-center justify-center h-full">
            <p>Select a chat to respond to queries.</p>
          </div>
        )
      )}

      {/* Side Pane */}
      {isStudentInfoPaneOpen && selectedChat !== undefined && (
        <SupportChatAreaStudentInformation />
      )}

      <div className="z-10">
        {/* Footer (Message Input) */}
        {messagesLoading ? (
          <SupportChatAreaFooterSkeleton />
        ) : (
          selectedChat && <SupportChatAreaFooter />
        )}
      </div>
    </div>
  );
};

export default SupportChatArea;
