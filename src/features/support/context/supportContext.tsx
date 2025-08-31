import { useAuth } from "@/app/context/authContext";
import { ProgramAdmin, SupportChat } from "@/app/models/SupportChat";
import { SupportChatMessage } from "@/app/models/SupportChatMessage";
import supportChatsService from "@/app/services/supportService";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

export const categoryFilters = ["All Cases", "Assigned Category Cases"];

const SupportChatsContext = createContext<{
  chats: SupportChat[];
  chatsLoading: boolean;
  adminsLoading: boolean;
  sendChatMessageLoading: boolean;
  messagesLoading: boolean;
  resolveChatLoading: boolean;
  isStudentInfoPaneOpen: boolean;
  error: string;
  selectedChat: SupportChat | undefined;
  chatFilter: string;
  chatFirstLoad: boolean;
  referChatLoading: boolean;
  revertResolveChatLoading: boolean;
  currentChatMessages: SupportChatMessage[];
  chatCategoryFilter: string;
  admins: ProgramAdmin[];
  referChat: ({
    referralNotes,
    administrator,
  }: {
    referralNotes: string;
    administrator: string;
  }) => Promise<void>;
  fetchChats: () => Promise<void>;
  fetchAdmins: () => Promise<void>;
  sendChatMessage: ({ message }: { message: string }) => Promise<void>;
  resolveChat: ({ chatId }: { chatId: string }) => Promise<void>;
  revertResolveChat: ({ chatId }: { chatId: string }) => Promise<void>;
  selectChat: (chat: SupportChat | undefined) => Promise<void>;
  setIsStudentInfoPaneOpen: (updateIsStudentInfoPaneOpen: boolean) => void;
  setChatFirstLoad: (updateChatFirstLoad: boolean) => void;
  setChatFilter: (updateChatFilter: string) => void;
  setChatCategoryFilter: (updateChatCategoryFilter: string) => void;
}>({
  chats: [],
  admins: [],
  currentChatMessages: [],
  chatsLoading: true,
  adminsLoading: true,
  sendChatMessageLoading: false,
  messagesLoading: false,
  referChatLoading: false,
  resolveChatLoading: false,
  chatFirstLoad: true,
  revertResolveChatLoading: false,
  error: "",
  chatCategoryFilter: categoryFilters[1],
  selectedChat: undefined,
  isStudentInfoPaneOpen: false,
  chatFilter: "",
  fetchChats: async () => {},
  referChat: async () => {},
  fetchAdmins: async () => {},
  sendChatMessage: async () => {},
  resolveChat: async () => {},
  selectChat: async () => {},
  setIsStudentInfoPaneOpen: () => {},
  setChatFilter: () => {},
  setChatCategoryFilter: () => {},
  setChatFirstLoad: () => {},
  revertResolveChat: async () => {},
});

export const SupportChatsProvider = ({ children }: { children: ReactNode }) => {
  const [chats, setChats] = useState<SupportChat[]>([]);
  const [currentChatMessages, setCurrentChatMessages] = useState<
    SupportChatMessage[]
  >([]);
  const [chatsLoading, setChatsLoading] = useState(true);
  const [adminsLoading, setAdminsLoading] = useState(true);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [sendChatMessageLoading, setSendChatMessageLoading] = useState(false);
  const [resolveChatLoading, setResolveChatLoading] = useState(false);
  const [referChatLoading, setReferChatLoading] = useState(false);
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
  const [admins, setAdmins] = useState<ProgramAdmin[]>([]);
  const [isChatFirstLoad, setIsChatFirstLoad] = useState(true);
  const [chatCategoryFilter, setChatCategoryFilter] = useState<string>(
    categoryFilters[1]
  );

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

  const fetchAdmins = async () => {
    if (isAuthenticated) {
      setAdminsLoading(true);
      try {
        const programAdmins = await supportChatsService.fetchProgramAdmins({
          program: user?.currentProgram?.id ?? "",
        });

        setAdmins(programAdmins.filter((admin) => admin.id !== user?.id));
      } catch (err) {
        setError(err);
      } finally {
        setAdminsLoading(false);
      }
    } else {
      setAdminsLoading(false);
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
          referralNote: false
        },
      ]);
      try {
        if (selectedChat?.status == "New") {
          await await supportChatsService.assignChat({
            administrator: user?.id ?? "",
            chat: selectedChat?.id ?? "",
          });
        }
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

  const referChat = async ({
    referralNotes,
    administrator,
  }: {
    referralNotes: string;
    administrator: string;
  }) => {
    if (isAuthenticated) {
      setReferChatLoading(true);

      try {
        await supportChatsService.referChat({
          referralNotes,
          administrator,
          referredBy: user!.id,
          chat: selectedChat!.id,
        });
      } catch (err) {
        console.log(err);
        setError(err);
      } finally {
        setReferChatLoading(false);
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

  useEffect(() => {
    fetchChats();
    fetchAdmins();
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

  return (
    <SupportChatsContext.Provider
      value={{
        admins,
        referChat,
        fetchAdmins,
        referChatLoading,
        adminsLoading,
        chatCategoryFilter,
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
        setChatCategoryFilter,
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
