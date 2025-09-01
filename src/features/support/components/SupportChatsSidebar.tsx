import SupportChatsSidebarChatCard, {
  SupportChatsSidebarChatCardSkeleton,
} from "./SupportChatsSidebarChatCard";
import SupportChatsSidebarHeader, {
  SupportChatsSidebarHeaderSkeleton,
} from "./SupportChatsSidebarHeader";
import { useSupportChats } from "../context/supportContext";
import { useAuth } from "@/app/context/authContext";
import { useMemo } from "react";

const MATCHED_STATUSES = new Set([
  "Engagements",
  "New",
  "In Progress",
  "Pending Resolve",
  "Resolved",
  "Referred",
] as const);

const SupportChatsSidebar = ({ width }: { width: string }) => {
  const { chats, selectedChat, chatCategoryFilter, chatFilter, chatsLoading } =
    useSupportChats();
  const { user } = useAuth();

  const filteredSortedChats = useMemo(() => {
    if (!Array.isArray(chats) || !MATCHED_STATUSES.has(chatFilter as any)) {
      return [];
    }

    const inAssignedCategory = (category?: string | null) =>
      !!category &&
      Array.isArray(user?.assignedCategories) &&
      user!.assignedCategories!.includes(category);

    const out = chats.filter((chat) => {
      if (chatFilter === "Engagements") {
        return chat.status === "Engage" && chat.assignee == user?.id; // show all New when not filtering to assigned categories
      }
      // “New”
      if (chatFilter === "New") {
        if (chatCategoryFilter === "Assigned Category Cases") {
          return (
            inAssignedCategory(chat.category) && chat.status === chatFilter
          );
        }
        return chat.status === chatFilter; // show all New when not filtering to assigned categories
      }

      // “In Progress”, “Pending Resolve”, “Resolved”
      if (
        chatFilter === "In Progress" ||
        chatFilter === "Pending Resolve" ||
        chatFilter === "Resolved"
      ) {
        // exclude items that this user referred
        if (chat.referredBy && chat.referredBy === user?.id) return false;

        // If assigned to me, include. If unassigned but in my category, include.
        if (chat.assignee && chat.assignee === user?.id)
          return chat.status === chatFilter;

        // Else still allow general match to keep your original “status only” rule:
        return chat.status === chatFilter && inAssignedCategory(chat.category);
      }

      // “Referred”
      if (chatFilter === "Referred") {
        // show if I referred it OR it’s in my category (keep your earlier idea)
        if (chat.referredBy && chat.referredBy === user?.id) return true;
        if (inAssignedCategory(chat.category) && chat.status === chatFilter)
          return true;
        return chat.status === chatFilter; // fallback to status-only if you want broader view
      }

      return false;
    });

    // Sort by latest message date desc
    out.sort((a, b) => {
      const dateA = a.latestMessage?.dateCreated
        ? new Date(a.latestMessage.dateCreated).getTime()
        : 0;
      const dateB = b.latestMessage?.dateCreated
        ? new Date(b.latestMessage.dateCreated).getTime()
        : 0;
      return dateB - dateA;
    });

    return out;
  }, [
    chats,
    chatFilter,
    chatCategoryFilter,
    user?.id,
    user?.assignedCategories,
  ]);

  return (
    <div
      style={{ width }}
      className={`${
        selectedChat ? "lg:flex hidden" : ""
      } pb-1 shadow-md bg-slate-100 border-r border-gray-300 h-full flex flex-col`}
    >
      {chatsLoading ? (
        <SupportChatsSidebarHeaderSkeleton />
      ) : (
        <SupportChatsSidebarHeader title="Support Inbox" />
      )}

      {chatsLoading ? (
        <div className="space-y-[2px] pb-4 pt-1 flex-1 overflow-y-auto">
          {Array.from({ length: 9 }).map((_, i) => (
            <SupportChatsSidebarChatCardSkeleton key={i} />
          ))}
        </div>
      ) : filteredSortedChats.length > 0 ? (
        <div className="space-y-[2px] pb-4 pt-1 overflow-y-auto flex-1">
          {filteredSortedChats.map((chat) => (
            <SupportChatsSidebarChatCard key={chat.id} chat={chat} />
          ))}
        </div>
      ) : (
        <div className="space-y-[12px] flex flex-col p-12 text-center flex-1 bg-white text-gray-500 justify-center items-center">
          <p>
            All{" "}
            <span className="font-semibold text-secondary">{chatFilter}</span>{" "}
            support cases will appear here.
          </p>
        </div>
      )}
    </div>
  );
};

export default SupportChatsSidebar;
