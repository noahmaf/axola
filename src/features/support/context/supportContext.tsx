import { useAuth } from "@/app/context/authContext";
import { SupportChat } from "@/app/models/SupportChat";
import { SupportChatMessage } from "@/app/models/SupportChatMessage";
import supportChatsService from "@/app/services/supportService";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

const SupportChatsContext = createContext<{
  chats: SupportChat[];
  chatsLoading: boolean;
  sendChatMessageLoading: boolean;
  messagesLoading: boolean;
  resolveChatLoading: boolean;
  isStudentInfoPaneOpen: boolean;
  error: string;
  selectedChat: SupportChat | undefined;
  chatFilter: string;
  chatFirstLoad: boolean;
  revertResolveChatLoading: boolean;
  currentChatMessages: SupportChatMessage[];
  fetchChats: () => Promise<void>;
  sendChatMessage: ({ message }: { message: string }) => Promise<void>;
  resolveChat: ({ chatId }: { chatId: string }) => Promise<void>;
  revertResolveChat: ({ chatId }: { chatId: string }) => Promise<void>;
  selectChat: (chat: SupportChat | undefined) => Promise<void>;
  setIsStudentInfoPaneOpen: (updateIsStudentInfoPaneOpen: boolean) => void;
  setChatFirstLoad: (updateChatFirstLoad: boolean) => void;
  setChatFilter: (updateChatFilter: string) => void;
}>({
  chats: [],
  currentChatMessages: [],
  chatsLoading: true,
  sendChatMessageLoading: false,
  messagesLoading: false,
  resolveChatLoading: false,
  chatFirstLoad: true,
  revertResolveChatLoading: false,
  error: "",
  selectedChat: undefined,
  isStudentInfoPaneOpen: false,
  chatFilter: "",
  fetchChats: async () => {},
  sendChatMessage: async () => {},
  resolveChat: async () => {},
  selectChat: async () => {},
  setIsStudentInfoPaneOpen: () => {},
  setChatFilter: () => {},
  setChatFirstLoad: () => {},
  revertResolveChat: async () => {},
});

export const SupportChatsProvider = ({ children }: { children: ReactNode }) => {
  const [chats, setChats] = useState<SupportChat[]>([]);
  const [currentChatMessages, setCurrentChatMessages] = useState<
    SupportChatMessage[]
  >([]);
  const [chatsLoading, setChatsLoading] = useState(true);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [sendChatMessageLoading, setSendChatMessageLoading] = useState(false);
  const [resolveChatLoading, setResolveChatLoading] = useState(false);
  const [revertResolveChatLoading, setRevertResolveChatLoading] =
    useState(false);
  const [chatFilter, setChatFilter] = useState<string>("In Progress");
  const [isStudentInfoPaneOpen, setIsStudentInfoPaneOpen] =
    useState<boolean>(false);
  const [error, setError] = useState<any>(null);
  const { isAuthenticated, user } = useAuth();
  const [selectedChat, setSelectedChat] = useState<SupportChat | undefined>(
    undefined
  );
  const [isChatFirstLoad, setIsChatFirstLoad] = useState(true);

  useEffect(() => {
    fetchChats();

    // Subscribe to real-time updates
    const handleSupportChatsUpdate = (
      updatedChats: SupportChat[],
      updatedChatMessages: SupportChatMessage[]
    ) => {
      setChats(updatedChats);
      setCurrentChatMessages(updatedChatMessages);
    };

    if (isAuthenticated) {
      supportChatsService.addListener(handleSupportChatsUpdate);
      supportChatsService.subscribeToChanges(user!.currentProgram!.id);
    }

    return () => {
      supportChatsService.removeListener(handleSupportChatsUpdate);
      supportChatsService.unsubscribeFromChanges();
      supportChatsService.unsubscribeFromChatMessages();
    };
  }, [user]);

  const fetchChats = async () => {
    if (isAuthenticated) {
      setChatsLoading(true);
      try {
        const fetchedChats = await supportChatsService.fetchSupportChats({
          program: user?.currentProgram?.id ?? "",
          status: "",
        });

        setChats(fetchedChats);
      } catch (err) {
        setError(err);
      } finally {
        setChatsLoading(false);
      }
    } else {
      setChatsLoading(false);
    }
  };

  const sendChatMessage = async ({ message }: { message: string }) => {
    if (isAuthenticated) {
      setSendChatMessageLoading(true);
      setCurrentChatMessages((prev) => [
        ...prev,
        {
          id: "id",
          chat: selectedChat?.id ?? "",
          content: message,
          dateCreated: Date() ?? "",
          administrator: user?.id,
          sent: true,
          read: false,
        },
      ]);
      try {
        await supportChatsService.sendMessage({
          message: message,
          administrator: user?.id ?? "",
          chat: selectedChat?.id ?? "",
        });
      } catch (err) {
        setError(err);
      } finally {
        setSendChatMessageLoading(false);
      }
    }
  };

  const resolveChat = async ({ chatId }: { chatId: string }) => {
    if (isAuthenticated) {
      setResolveChatLoading(true);

      try {
        await supportChatsService.resolveChat({
          chat: chatId,
        });
      } catch (err) {
        setError(err);
      } finally {
        setResolveChatLoading(false);
      }
    }
  };

  const revertResolveChat = async ({ chatId }: { chatId: string }) => {
    if (isAuthenticated) {
      setRevertResolveChatLoading(true);

      try {
        await supportChatsService.revertResolveChat({
          chat: chatId,
        });
      } catch (err) {
        setError(err);
      } finally {
        setRevertResolveChatLoading(false);
      }
    }
  };

  const selectChat = async (chat: SupportChat | undefined) => {
    if (!chat) {
      supportChatsService.unsubscribeFromChatMessages();
      setSelectedChat(chat);
      return;
    }

    if (isAuthenticated) {
      supportChatsService.unsubscribeFromChatMessages();
      setMessagesLoading(true);

      try {
        if (
          !chat.latestMessage.read &&
          chat.latestMessage.administrator === null
        ) {
          await supportChatsService.openChat({
            chat: chat.id,
            program: user?.currentProgram?.id ?? "",
          });
        }

        await supportChatsService.fetchChatMessages({
          chat: chat?.id ?? "",
        });

        setSelectedChat(chat);
        supportChatsService.subscribeToChatMessagesChanges(
          chat!.id!,
          user?.currentProgram?.id ?? ""
        );
      } catch (err) {
        setError(err);
      } finally {
        setMessagesLoading(false);
        setIsChatFirstLoad(true);
      }
    } else {
      setMessagesLoading(false);
      setIsChatFirstLoad(true);
    }
  };

  return (
    <SupportChatsContext.Provider
      value={{
        chats,
        currentChatMessages,
        selectedChat,
        chatsLoading,
        error,
        isStudentInfoPaneOpen,
        revertResolveChatLoading,
        chatFilter,
        messagesLoading,
        sendChatMessageLoading,
        resolveChatLoading,
        chatFirstLoad: isChatFirstLoad,
        resolveChat,
        revertResolveChat,
        fetchChats,
        sendChatMessage,
        selectChat,
        setIsStudentInfoPaneOpen,
        setChatFilter,
        setChatFirstLoad: setIsChatFirstLoad,
      }}
    >
      {children}
    </SupportChatsContext.Provider>
  );
};

export const useSupportChats = () => {
  const context = useContext(SupportChatsContext);

  if (!context)
    throw new Error(
      "useSupportChats should be used within a SupportChatsProvider"
    );

  return context;
};
