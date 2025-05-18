import { SupportNote } from "./SupportChat";

export interface Announcement {
  id: string;
  title: string;
  message: string;
  date: string;
  program: string;
  category: string;
}

export interface CreateAnnouncementRequest {
  title: string;
  message: string;
  category: string;
  program: string;
  study_programme: string;
  study_level: string;
}

export interface CreateNoteRequest {
  title: string;
  content: string;
  category: string;
  student: string;
  administrator: string;
}

export interface UpdateAnnouncementSchema {
  title: string;
  message: string;
  category: string;
}

export interface UpdateNoteSchema {
  title: string;
  content: string;
}

export interface UpdateNoteRequest {
  originalNote: SupportNote;
  updatedNote: Partial<SupportNote>;
}

export interface UpdateAnnouncementRequest {
  originalAnnouncement: Announcement;
  updatedAnnouncement: Partial<Announcement>;
}

export interface DeleteAnnouncementRequest {
  id: string;
}
