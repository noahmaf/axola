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
  assignee?: string;
  referredBy?: string;
  latestMessage: SupportChatMessage;
  program: string;
};

export type ProgramAdmin = {
  id: string;
  name: string;
  surname: string;
  avatar: string;
  categories: string[];
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

export interface FetchProgramAdminsRequest {
  program: string;
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

export interface AssignChatRequest {
  chat: string;
  administrator: string;
}

export interface ReferChatRequest {
  chat: string;
  administrator: string;
  referredBy: string;
  referralNotes: string;
}
