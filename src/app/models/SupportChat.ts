import { AxolaStudent } from "./AxolaStudent";
import { SupportChatMessage } from "./SupportChatMessage";

export type SupportChat = {
  id: string;
  dateCreated: string;
  dateUpdated: string;
  title: string;
  user: AxolaStudent;
  category: string;
  status: string;
  latestMessage: SupportChatMessage;
  program: string;
};

export type SupportNote = {
  id: string;
  createdAt: string;
  updatedAt: string;
  title: string;
  content: string;
  category: string;
  student: string;
  administrator: string;
  program: string;
};

export interface FetchSupportChatsRequest {
  program: string;
  status: string;
}

export interface FetchSupportChatMessagesRequest {
  chat: string;
}

export interface OpenChatRequest {
  chat: string;
  program: string;
}

export interface SendMessageRequest {
  chat: string;
  administrator: string;
  message: string;
}

export interface ResolveChatRequest {
  chat: string;
}
