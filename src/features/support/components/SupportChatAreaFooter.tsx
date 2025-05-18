import { useEffect, useRef, useState } from "react";
import { IoSend } from "react-icons/io5";
import { MdExpandLess, MdExpandMore } from "react-icons/md";
import { AiOutlineFileDone } from "react-icons/ai";
import { GoCrossReference } from "react-icons/go";
import SupportChatAreaFooterActionButton, {
  SupportChatAreaFooterActionButtonSkeleton,
} from "./SupportChatAreaFooterActionButton";
import { useSupportChats } from "../context/supportContext";
import CircularLoadingSpinner from "@/components/CircularLoadingSpinner";
import ChatPendingResolveCard from "./ChatPendingResolveCard";

const SupportChatAreaFooter = () => {
  const {
    sendChatMessage,
    sendChatMessageLoading,
    selectedChat,
    resolveChat,
    selectChat,
  } = useSupportChats();

  const [message, setMessage] = useState<string>("");
  const [showActions, setShowActions] = useState(true);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const maxRows = 4;

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.rows = 1;
      const currentRows = Math.min(
        textareaRef.current.scrollHeight / 24,
        maxRows
      );
      textareaRef.current.rows = Math.floor(currentRows);
    }
  }, [message]);

  const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    e.preventDefault();
    setMessage(e.target.value);
  };

  const sendMessage = async () => {
    if (message) {
      sendChatMessage({ message: message! });
      setMessage("");
    }
  };

  return (
    <div className="h-fit bg-pageBackground p-4 flex flex-col items-center border-t border-gray-300">
      {selectedChat?.status === "In Progress" && (
        <div className="flex w-full my-2 items-end">
          <textarea
            rows={1}
            placeholder="Type a message..."
            ref={textareaRef}
            value={message}
            onChange={handleMessageChange}
            className="w-full place-content-center content-center rounded-lg border message-input overflow-auto resize-none "
          />
          {message && !/^[\s]*$/.test(message!) && (
            <button
              onClick={sendMessage}
              className="ml-4 p-3 flex items-center justify-center bg-secondary text-xl h-10 w-10 text-white rounded-lg"
            >
              {sendChatMessageLoading ? (
                <CircularLoadingSpinner
                  className="flex items-center w-full justify-center "
                  color="white"
                />
              ) : (
                <IoSend />
              )}
            </button>
          )}
          {/^[\s]*$/.test(message!) && (
            <button
              onClick={() => {
                setShowActions((prev) => !prev);
              }}
              className="ml-4  flex bg-secondary text-2xl h-10 w-10 items-center justify-center text-white rounded-lg"
            >
              {!showActions ? <MdExpandMore /> : <MdExpandLess />}
            </button>
          )}
        </div>
      )}
      {showActions && selectedChat?.status !== "Resolved" && (
        <div className="flex space-x-4 mt-4 justify-start w-full">
          {selectedChat?.status === "In Progress" && (
            <>
              <SupportChatAreaFooterActionButton
                title="Resolve"
                icon={AiOutlineFileDone}
                onTap={() => {
                  resolveChat({ chatId: selectedChat.id });
                  selectChat(undefined);
                }}
              />
              <SupportChatAreaFooterActionButton
                title="Refer"
                icon={GoCrossReference}
                onTap={() => {}}
              />
            </>
          )}

          {selectedChat?.status === "Pending Resolve" && (
            <ChatPendingResolveCard />
          )}
        </div>
      )}

      {selectedChat?.status === "Resolved" && (
        <div className="items-center justify-center flex flex-col px-4 bg-green-500 bg-opacity-10 rounded-md py-6 w-full">
          <p className="text-green-500 font-semibold text-lg">
            This chat has been resolved and cannot be updated.
          </p>
        </div>
      )}
    </div>
  );
};

export default SupportChatAreaFooter;

export const SupportChatAreaFooterSkeleton = () => {
  return (
    <div className="h-fit bg-pageBackground p-4 flex flex-col items-center border-t border-gray-300 text-transparent select-none">
      <div className="flex w-full my-2">
        <div className="w-full bg-secondary bg-opacity-20 h-10 rounded-md">
          _
        </div>
        <div className="ml-4 p-3 bg-secondary bg-opacity-20 rounded-lg h-10 w-10">
          _
        </div>
      </div>

      <div className="flex space-x-4 mt-4 justify-start w-full">
        <SupportChatAreaFooterActionButtonSkeleton />
        <SupportChatAreaFooterActionButtonSkeleton />
      </div>
    </div>
  );
};
