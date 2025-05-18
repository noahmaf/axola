import { useSupportChats } from "../context/supportContext";

const SupportChatsSidebarHeaderFilterButton = ({
  activeFilter,
  onClick,
  filter,
}: {
  activeFilter: string | undefined;
  onClick: (filter: string) => void;
  filter: string;
}) => {
  const { chats } = useSupportChats();

  const handleOnClick = () => {
    if (activeFilter === filter) {
      onClick("");
      return;
    }
    onClick(filter);
  };

  return (
    <div className="relative">
      <button
        onClick={handleOnClick}
        className={`inline-flex py-2 px-5 items-center whitespace-nowrap ${
          activeFilter === filter
            ? "bg-secondary text-white"
            : "bg-gray-200 text-gray-500"
        } text-sm font-medium  rounded-full`}
      >
        {filter}
      </button>

      {chats.filter(
        (chat) =>
          !chat.latestMessage.read &&
          chat.latestMessage.student !== null &&
          chat.status == filter
      ).length !== 0 && (
        <div className="absolute -top-1 -left-1 bg-orange-500 text-white text-sm font-bold flex items-center justify-center rounded-full h-5 w-5">
          {chats
            .filter(
              (chat) =>
                !chat.latestMessage.read && chat.latestMessage.student !== null
            )
            .length.toString()}
        </div>
      )}
    </div>
  );
};

export default SupportChatsSidebarHeaderFilterButton;

export const SupportChatsSidebarHeaderFilterButtonSkeleton = () => {
  return (
    <div
      className={`inline-flex py-2 px-5 items-center whitespace-nowrap text-sm font-medium  rounded-full bg-secondary bg-opacity-20 w-[30%]`}
    >
      _
    </div>
  );
};
