export type SupportChatMessage = {
  id: string;
  chat: string;
  dateCreated: string;
  content: string;
  student?: string;
  administrator?: string;
  sent: boolean;
  read: boolean;
  referralNote: boolean;
};
