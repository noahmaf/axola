import { useSupportChats } from "../context/supportContext";

const ChatPendingResolveCard = () => {
  const { selectedChat, selectChat, revertResolveChat } = useSupportChats();

  return (
    <div className="w-full text-secondary bg-secondary bg-opacity-10 rounded-md px-2 py-6 flex flex-col space-y-6 items-center justify-center">
      <p className="font-semibold  text-lg">Case pending resolve</p>

      <div className="flex flex-col space-y-1 items-center justify-center">
        <p>
          This case will be resolved once the student acknowledges the
          assistance received.
        </p>
        <p>You can also move this chat back into In Progress below.</p>
      </div>

      <div className="flex space-x-2">
        <div
          className="button bg-white text-secondary"
          onClick={() => {
            revertResolveChat({ chatId: selectedChat?.id ?? "" });
            selectChat(undefined);
          }}
        >
          Revert to In Progress
        </div>
        <div className="button text-white bg-secondary">Refer</div>
      </div>
    </div>
  );
};

export default ChatPendingResolveCard;
