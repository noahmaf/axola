import { supabase } from "@/api/supabaseClient";

import { formatDateTime } from "@/app/utils/dateFormat";
import {
  FetchSupportChatMessagesRequest,
  FetchSupportChatsRequest,
  OpenChatRequest,
  ResolveChatRequest,
  SendMessageRequest,
  SupportChat,
} from "../models/SupportChat";
import { SupportChatMessage } from "../models/SupportChatMessage";

const supportChatsService = {
  supportChats: [] as SupportChat[],
  currentChatMessages: [] as SupportChatMessage[],

  listeners: [] as ((
    supportChats: SupportChat[],
    chatMessages: SupportChatMessage[]
  ) => void)[],

  supportChatsChannel: null as ReturnType<typeof supabase.channel> | null,
  supportChatMessagesChannel: null as ReturnType<
    typeof supabase.channel
  > | null,

  async fetchSupportChats(fetchSupportChatsRequest: FetchSupportChatsRequest) {
    try {
      const { data, error } = await supabase
        .from("chats")
        .select(
          "*,latest_message:chat_messages!chats_latest_message_fkey(*), program:programs(*),user:students(*)"
        )
        .eq("program", fetchSupportChatsRequest.program)
        .order("created_at", { ascending: false });

      if (error) throw error;

      const formattedSupportChats: SupportChat[] = (data || []).map((chat) => {
        return {
          id: chat.id,
          title: chat.title,
          dateCreated: formatDateTime(chat.created_at),
          dateUpdated: formatDateTime(chat.updated_at),
          user: {
            id: chat.user.id,
            program: {
              id: chat.program.id,
              name: chat.program.name,
              university: chat.program.university,
            },
            name: chat.user.name,
            surname: chat.user.surname,
            email: chat.user.email,
            studentNumber: chat.user.student_number,
            university: chat.user.university,
            profilePicture: chat.user.profile_picture,
            levelOfStudy: chat.user.level_of_study,
            studyProgramme: chat.user.study_programme,
            cellphoneNumber: chat.user.cellphone_number,
            whatsappNumber: chat.user.whatsapp_number,
          },
          status: chat.status,
          category: chat.category,
          program: chat.program,
          latestMessage: {
            id: chat.latest_message.id,
            chat: chat.latest_message.chat,
            content: chat.latest_message.content,
            dateCreated: chat.latest_message.created_at,
            administrator: chat.latest_message.administrator,
            student: chat.latest_message.student,
            sent: chat.latest_message.administrator !== null,
            read: chat.latest_message.read,
          },
        };
      });

      supportChatsService.supportChats = formattedSupportChats;
      supportChatsService.notifyListeners();

      return formattedSupportChats;
    } catch (error) {
      throw error;
    }
  },

  async openChat(openChatRequest: OpenChatRequest) {
    const { data, error } = await supabase
      .from("chat_messages")
      .update({
        read: true,
      })
      .eq("chat", openChatRequest.chat);

    await supportChatsService.fetchSupportChats({
      program: openChatRequest.program,
      status: "",
    });
    supportChatsService.notifyListeners();

    if (error) throw error;
    return data;
  },

  async fetchChatMessages(
    fetchSupportChatMessagesRequest: FetchSupportChatMessagesRequest
  ) {
    const { data, error } = await supabase
      .from("chat_messages")
      .select("*")
      .eq("chat", fetchSupportChatMessagesRequest.chat)
      .order("created_at", { ascending: true });

    if (error) throw error;

    const formattedSupportChatMessages: SupportChatMessage[] = (data || []).map(
      (chatMessage) => {
        return {
          id: chatMessage.id,
          chat: chatMessage.chat,
          content: chatMessage.content,
          dateCreated: chatMessage.created_at,
          administrator: chatMessage.administrator,
          student: chatMessage.student,
          sent: chatMessage.administrator !== null,
          read: chatMessage.read,
        };
      }
    );

    supportChatsService.currentChatMessages = formattedSupportChatMessages;
    supportChatsService.notifyListeners();

    return formattedSupportChatMessages;
  },

  async sendMessage(sendMessageRequest: SendMessageRequest) {
    const { data, error } = await supabase.from("chat_messages").insert({
      chat: sendMessageRequest.chat,
      content: sendMessageRequest.message,
      administrator: sendMessageRequest.administrator,
    });

    if (error) throw error;

    await supportChatsService.fetchChatMessages({
      chat: sendMessageRequest.chat,
    });

    return data;
  },

  async resolveChat(resolveChatRequest: ResolveChatRequest) {
    const { data, error } = await supabase
      .from("chats")
      .update({
        status: "Pending Resolve",
      })
      .eq("id", resolveChatRequest.chat);

    if (error) throw error;

    return data;
  },

  async revertResolveChat(resolveChatRequest: ResolveChatRequest) {
    const { data, error } = await supabase
      .from("chats")
      .update({
        status: "In Progress",
      })
      .eq("id", resolveChatRequest.chat);

    if (error) throw error;

    return data;
  },

  subscribeToChanges(program: string) {
    if (supportChatsService.supportChatsChannel) return;

    supportChatsService.supportChatsChannel = supabase.channel("public:chats");

    supportChatsService.supportChatsChannel.on(
      "postgres_changes",
      { event: "INSERT", schema: "public", table: "chats" },
      async (payload) => {
        if (payload.new.program === program) {
          await supportChatsService.fetchSupportChats({
            program,
            status: "",
          });
          supportChatsService.notifyListeners();
        }
      }
    );

    supportChatsService.supportChatsChannel.on(
      "postgres_changes",
      { event: "UPDATE", schema: "public", table: "chats" },
      async (payload) => {
        if (payload.new.program === program) {
          await supportChatsService.fetchSupportChats({ program, status: "" });
          supportChatsService.notifyListeners();
        }
      }
    );

    supportChatsService.supportChatsChannel.on(
      "postgres_changes",
      { event: "DELETE", schema: "public", table: "chats" },
      (payload) => {
        supportChatsService.supportChats =
          supportChatsService.supportChats.filter(
            (step) => step.id !== payload.old.id
          );

        supportChatsService.notifyListeners();
      }
    );

    supportChatsService.supportChatsChannel.subscribe();
  },

  subscribeToChatMessagesChanges(chat: string, program: string) {
    if (supportChatsService.supportChatMessagesChannel) return;

    supportChatsService.supportChatMessagesChannel = supabase.channel(
      "public:chat_messages"
    );

    supportChatsService.supportChatMessagesChannel.on(
      "postgres_changes",
      { event: "INSERT", schema: "public", table: "chat_messages" },
      async (payload) => {
        if (payload.new.chat == chat) {
          await supportChatsService.openChat({ chat: chat, program });
          if (payload.new.administrator !== null) {
            supportChatsService.currentChatMessages[
              supportChatsService.currentChatMessages.length - 1
            ] = {
              id: payload.new.id,
              chat: payload.new.chat,
              content: payload.new.content,
              dateCreated: payload.new.created_at,
              administrator: payload.new.administrator,
              student: payload.new.student,
              sent: payload.new.administrator !== null,
              read: payload.new.read,
            };
          } else if (payload.new.student !== null) {
            supportChatsService.currentChatMessages.push({
              id: payload.new.id,
              chat: payload.new.chat,
              content: payload.new.content,
              dateCreated: payload.new.created_at,
              administrator: payload.new.administrator,
              student: payload.new.student,
              sent: payload.new.administrator !== null,
              read: payload.new.read,
            });
          }
          supportChatsService.notifyListeners();
        }
      }
    );

    // supportChatsService.supportChatMessagesChannel.on(
    //   "postgres_changes",
    //   { event: "UPDATE", schema: "public", table: "chat_messages" },
    //   async (payload) => {
    //     if (payload.new.chat === chat) {
    //       await supportChatsService.fetchChatMessages({ chat });
    //       supportChatsService.notifyListeners();
    //     }
    //   }
    // );

    // supportChatsService.supportChatMessagesChannel.on(
    //   "postgres_changes",
    //   { event: "DELETE", schema: "public", table: "chat_messages" },
    //   async (payload) => {
    //     if (payload.old.chat === chat) {
    //       await supportChatsService.fetchChatMessages({ chat });
    //       supportChatsService.notifyListeners();
    //     }
    //   }
    // );

    supportChatsService.supportChatMessagesChannel.subscribe();
  },

  unsubscribeFromChatMessages() {
    if (supportChatsService.supportChatMessagesChannel) {
      supportChatsService.supportChatMessagesChannel.unsubscribe();
      supabase.removeChannel(supportChatsService.supportChatMessagesChannel);
      supportChatsService.supportChatMessagesChannel = null;
    }
  },

  unsubscribeFromChanges() {
    if (
      supportChatsService.supportChatsChannel &&
      supportChatsService.listeners.length === 0
    ) {
      supportChatsService.supportChatsChannel.unsubscribe();
      supabase.removeChannel(supportChatsService.supportChatsChannel);
      supportChatsService.supportChatsChannel = null;
    }
  },

  addListener(
    listener: (
      supportChats: SupportChat[],
      supportChatMessages: SupportChatMessage[]
    ) => void
  ) {
    supportChatsService.listeners.push(listener);
    listener(
      supportChatsService.supportChats,
      supportChatsService.currentChatMessages
    );
  },

  removeListener(
    listener: (
      supportChats: SupportChat[],
      supportChatMessages: SupportChatMessage[]
    ) => void
  ) {
    supportChatsService.listeners = supportChatsService.listeners.filter(
      (l) => l != listener
    );
  },
  notifyListeners() {
    supportChatsService.listeners.forEach((listener) => {
      listener(
        supportChatsService.supportChats,
        supportChatsService.currentChatMessages
      );
    });
  },
};

export default supportChatsService;
