import { useAuth } from "@/app/context/authContext";
import {
  Announcement,
  CreateAnnouncementRequest,
} from "@/app/models/Announcement";
import announcementService from "@/app/services/announcementsService";
import {
  useState,
  useEffect,
  createContext,
  ReactNode,
  useContext,
} from "react";

const AnnouncementsContext = createContext<{
  announcements: Announcement[];
  studyLevels: string[];
  studyProgrammes: string[];
  createAnnouncementLoading: boolean;
  deleteAnnouncementLoading: boolean;
  updateAnnouncementLoading: boolean;
  announcementsLoading: boolean;
  fetchAnnouncements: () => Promise<void>;
  createAnnouncement: ({
    title,
    message,
    category,
    studyLevel,
    studyProgramme,
  }: {
    title: string;
    message: string;
    category: string;
    studyLevel: string;
    studyProgramme: string;
  }) => Promise<void>;
  deleteAnnouncement: ({ id }: { id: string }) => Promise<void>;
  updateAnnouncement: ({
    originalAnnouncement,
    updatedAnnouncement,
  }: {
    originalAnnouncement: Announcement;
    updatedAnnouncement: Partial<Announcement>;
  }) => Promise<void>;
}>({
  studyLevels: [],
  studyProgrammes: [],
  announcements: [],
  createAnnouncementLoading: false,
  deleteAnnouncementLoading: false,
  updateAnnouncementLoading: false,
  announcementsLoading: false,
  fetchAnnouncements: async () => {},
  createAnnouncement: async () => {},
  deleteAnnouncement: async () => {},
  updateAnnouncement: async () => {},
});

export const AnnouncementsProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const { user } = useAuth();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [studyLevels, setStudyLevels] = useState<string[]>([]);
  const [studyProgrammes, setStudyProgrammes] = useState<string[]>([]);
  const [createAnnouncementLoading, setCreateAnnouncementLoading] =
    useState<boolean>(false);
  const [deleteAnnouncementLoading, setDeleteAnnouncementLoading] =
    useState<boolean>(false);
  const [updateAnnouncementLoading, setUpdateAnnouncementLoading] =
    useState<boolean>(false);
  const [announcementsLoading, setAnnouncementsLoading] =
    useState<boolean>(false);

  useEffect(() => {
    if (!user || !user!.currentProgram) return;

    fetchAnnouncements();

    // Subscribe to real-time updates
    const handleAnnouncementsUpdate = (
      updatedAnnouncements: Announcement[]
    ) => {
      setAnnouncements(updatedAnnouncements);
    };

    announcementService.addListener(handleAnnouncementsUpdate);
    announcementService.subscribeToChanges(user!.currentProgram!.id);

    return () => {
      announcementService.removeListener(handleAnnouncementsUpdate);
      announcementService.unsubscribeFromChanges();
    };
  }, [user]);

  const fetchAnnouncements = async () => {
    setAnnouncementsLoading(true);
    try {
      const levels = await announcementService.fetchStudyLevels(user!);
      const programmes = await announcementService.fetchStudyProgrammes(user!);
      const data = await announcementService.fetchAnnouncements(user!);
      setAnnouncements(data);
      setStudyLevels(levels);
      setStudyProgrammes(programmes);
    } catch (error) {
      console.error(error);
    } finally {
      setAnnouncementsLoading(false);
    }
  };

  const createAnnouncement = async ({
    title,
    message,
    category,
    studyLevel,
    studyProgramme,
  }: {
    title: string;
    message: string;
    category: string;
    studyLevel: string;
    studyProgramme: string;
  }) => {
    const newAnnouncement: CreateAnnouncementRequest = {
      title: title,
      message: message,
      category: category,
      program: user?.currentProgram?.id ?? "",
      study_level: studyLevel,
      study_programme: studyProgramme,
    };

    setCreateAnnouncementLoading(true);
    try {
      await announcementService.postNewAnnouncement(newAnnouncement);
    } catch (error) {
      console.error(error);
    } finally {
      setCreateAnnouncementLoading(false);
    }
  };

  const deleteAnnouncement = async ({ id }: { id: string }) => {
    setDeleteAnnouncementLoading(true);
    try {
      await announcementService.deleteAnnouncement({ id });
    } catch (error) {
      console.error(error);
    } finally {
      setDeleteAnnouncementLoading(false);
    }
  };

  const updateAnnouncement = async ({
    originalAnnouncement,
    updatedAnnouncement,
  }: {
    originalAnnouncement: Announcement;
    updatedAnnouncement: Partial<Announcement>;
  }) => {
    setUpdateAnnouncementLoading(true);
    try {
      await announcementService.updateAnnouncement({
        originalAnnouncement,
        updatedAnnouncement,
      });
    } catch (error) {
      console.error(error);
    } finally {
      setUpdateAnnouncementLoading(false);
    }
  };

  return (
    <AnnouncementsContext.Provider
      value={{
        studyLevels,
        studyProgrammes,
        announcements,
        createAnnouncement,
        updateAnnouncement,
        deleteAnnouncement,
        fetchAnnouncements,
        announcementsLoading,
        createAnnouncementLoading,
        updateAnnouncementLoading,
        deleteAnnouncementLoading,
      }}
    >
      {children}
    </AnnouncementsContext.Provider>
  );
};

export const useAnnouncements = () => {
  const context = useContext(AnnouncementsContext);

  if (!context)
    throw new Error(
      "useAnnouncements should be used withing an AnnouncementsProvider"
    );

  return context;
};
