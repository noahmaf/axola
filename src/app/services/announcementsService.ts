import { formatDateTime } from "@/app/utils/dateFormat";
import {
  Announcement,
  CreateAnnouncementRequest,
  DeleteAnnouncementRequest,
  UpdateAnnouncementRequest,
} from "../models/Announcement";
import { supabase } from "@/api/supabaseClient";
import { AxolaUser } from "../models/AxolaUser";

const announcementsService = {
  announcements: [] as Announcement[],
  listeners: [] as ((announcements: Announcement[]) => void)[],
  channel: null as ReturnType<typeof supabase.channel> | null,

  async postNewAnnouncement(
    createAnnouncementRequest: CreateAnnouncementRequest
  ) {
    const { data, error } = await supabase
      .from("announcements")
      .insert(createAnnouncementRequest);
    if (error) throw error;
    return data;
  },

  async updateAnnouncement(
    updateAnnouncementRequest: UpdateAnnouncementRequest
  ) {
    let changes: Partial<Announcement> = {};
    for (const key in updateAnnouncementRequest.originalAnnouncement) {
      if (
        updateAnnouncementRequest.updatedAnnouncement[
          key as keyof Announcement
        ] !==
        updateAnnouncementRequest.originalAnnouncement[
          key as keyof Announcement
        ]
      ) {
        changes[key as keyof Announcement] =
          updateAnnouncementRequest.updatedAnnouncement[
            key as keyof Announcement
          ];
      }
    }

    const { data, error } = await supabase
      .from("announcements")
      .update(changes)
      .eq("id", updateAnnouncementRequest.originalAnnouncement.id);
    if (error) throw error;
    return data;
  },

  async deleteAnnouncement(
    deleteAnnouncementRequest: DeleteAnnouncementRequest
  ) {
    const { data, error } = await supabase
      .from("announcements")
      .delete()
      .eq("id", deleteAnnouncementRequest.id);
    if (error) throw error;
    return data;
  },

  async fetchStudyLevels(currentUser: AxolaUser) {
    const { data, error } = await supabase
      .from("students")
      .select("level_of_study", { count: "exact", head: false })
      .neq("level_of_study", null)
      .eq("program", currentUser.currentProgram?.id);

    if (error) throw error;

    const uniqueLevels = Array.from(
      new Set(data.map((item) => item.level_of_study))
    );

    return uniqueLevels;
  },

  async fetchStudyProgrammes(currentUser: AxolaUser) {
    const { data, error } = await supabase
      .from("students")
      .select("study_programme", { count: "exact", head: false })
      .neq("study_programme", null)
      .eq("program", currentUser.currentProgram?.id);

    if (error) throw error;

    const uniquePrograms = Array.from(
      new Set(data.map((item) => item.study_programme))
    );

    return uniquePrograms;
  },

  async fetchAnnouncements(currentUser: AxolaUser) {
    const { data, error } = await supabase
      .from("announcements")
      .select("*")
      .eq("program", currentUser.currentProgram?.id)
      .order("created_at", { ascending: false });

    if (error) throw error;

    const formattedAnnouncements: Announcement[] = (data || []).map(
      (announcement) => ({
        id: announcement.id,
        title: announcement.title,
        message: announcement.message,
        date: formatDateTime(announcement.created_at),
        category: announcement.category,
        program: announcement.program,
      })
    );

    announcementsService.announcements = formattedAnnouncements;
    announcementsService.notifyListeners();

    return formattedAnnouncements;
  },

  subscribeToChanges(program: string) {
    if (announcementsService.channel) return;

    announcementsService.channel = supabase.channel("public:announcements");

    // Listen for INSERT events
    announcementsService.channel.on(
      "postgres_changes",
      { event: "INSERT", schema: "public", table: "announcements" },
      (payload) => {
        if (payload.new.program === program) {
          announcementsService.announcements = [
            {
              id: payload.new.id,
              title: payload.new.title,
              message: payload.new.message,
              date: formatDateTime(payload.new.created_at),
              category: payload.new.category,
              program: payload.new.program,
            },
            ...announcementsService.announcements,
          ];

          announcementsService.notifyListeners();
        }
      }
    );

    // Listen for UPDATE events
    announcementsService.channel.on(
      "postgres_changes",
      { event: "UPDATE", schema: "public", table: "announcements" },
      (payload) => {
        if (payload.new.program === program) {
          announcementsService.announcements =
            announcementsService.announcements.map((announcement) =>
              announcement.id === payload.new.id
                ? ({
                    id: payload.new.id,
                    title: payload.new.title,
                    message: payload.new.message,
                    date: formatDateTime(payload.new.created_at),
                    category: payload.new.category,
                    program: payload.new.program,
                  } as Announcement)
                : announcement
            );
          announcementsService.notifyListeners();
        }
      }
    );

    // Listen for DELETE events
    announcementsService.channel.on(
      "postgres_changes",
      { event: "DELETE", schema: "public", table: "announcements" },
      (payload) => {
        announcementsService.announcements =
          announcementsService.announcements.filter(
            (announcement) => announcement.id !== payload.old.id
          );

        announcementsService.notifyListeners();
      }
    );

    // Subscribe and handle channel state
    announcementsService.channel.subscribe();
  },

  unsubscribeFromChanges() {
    if (
      announcementsService.channel &&
      announcementsService.listeners.length === 0
    ) {
      announcementsService.channel.unsubscribe();
      supabase.removeChannel(announcementsService.channel);
      announcementsService.channel = null;
    }
  },

  addListener(listener: (announcements: Announcement[]) => void) {
    announcementsService.listeners.push(listener);
    listener(announcementsService.announcements);
  },

  removeListener(listener: (announcements: Announcement[]) => void) {
    announcementsService.listeners = announcementsService.listeners.filter(
      (l) => l !== listener
    );
  },

  notifyListeners() {
    announcementsService.listeners.forEach((listener) =>
      listener(announcementsService.announcements)
    );
  },
};

export default announcementsService;
