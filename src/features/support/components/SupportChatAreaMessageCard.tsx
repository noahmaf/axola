import { SupportChatMessage } from "@/app/models/SupportChatMessage";
import { formatTime } from "@/app/utils/dateFormat";

const SupportChatAreaMessageCard = ({
  chatMessage,
}: {
  chatMessage: SupportChatMessage;
}) => {
  return (
    <div
      className={`flex select-none ${
        chatMessage.sent ? "justify-end" : "justify-start"
      }`}
    >
      <div
        className={`${
          chatMessage.sent
            ? "bg-secondary text-white rounded-tr-none"
            : "bg-gray-50 text-black rounded-tl-none"
        } p-2  rounded-lg max-w-xs text-sm flex flex-col`}
      >
        <p>{chatMessage.content}</p>

        <span className="w-full justify-end flex text-orange-500 font-medium pt-1">
          {formatTime(chatMessage.dateCreated)}
        </span>
      </div>
    </div>
  );
};

export default SupportChatAreaMessageCard;

export const SupportChatAreaMessageCardSkeleton = ({
  sent,
}: {
  sent: boolean;
}) => {
  return (
    <div className={`flex ${sent ? "justify-end" : "justify-start"}`}>
      <div
        className={`bg-secondary bg-opacity-15 p-2 rounded-lg max-w-xs text-sm w-[50%] text-transparent`}
      >
        _
      </div>
    </div>
  );
};
