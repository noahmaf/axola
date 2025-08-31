import { useAuth } from "@/app/context/authContext";
import { CreateNoteRequest } from "@/app/models/Announcement";
import { AxolaStudent } from "@/app/models/AxolaStudent";
import { SupportNote } from "@/app/models/SupportChat";
import studentsService from "@/app/services/studentsService";
import { exportStudentsToExcel } from "@/app/utils/xlsx";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

const StudentsContext = createContext<{
  students: AxolaStudent[];
  studentsLoading: boolean;
  updateNoteLoading: boolean;
  isExportLoading: boolean;
  createNoteLoading: boolean;
  fetchStudents: () => Promise<void>;
  exportStudents: () => Promise<void>;
  createNote: ({
    title,
    content,
    student,
    category,
    administrator,
  }: {
    title: string;
    category: string;
    content: string;
    student: string;
    administrator: string;
  }) => Promise<void>;
  updateNote: ({
    originalNote,
    updatedNote,
  }: {
    originalNote: SupportNote;
    updatedNote: Partial<SupportNote>;
  }) => Promise<void>;
}>({
  students: [],
  fetchStudents: async () => {},
  exportStudents: async () => {},
  createNote: async () => {},
  updateNote: async () => {},
  studentsLoading: true,
  isExportLoading: false,
  updateNoteLoading: false,
  createNoteLoading: false,
});

export const StudentsProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [students, setStudents] = useState<AxolaStudent[]>([]);
  const [studentsLoading, setStudentsLoading] = useState<boolean>(false);
  const [isExportLoading, setIsExportLoading] = useState<boolean>(false);
  const [updateNoteLoading, setUpdateNoteLoading] = useState<boolean>(false);
  const [createNoteLoading, setCreateNoteLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!user || !user!.currentProgram) return;

    fetchStudents();

    // Subscribe to real-time updates
    const handleStudentsUpdate = (updatedStudents: AxolaStudent[]) => {
      setStudents(updatedStudents);
    };

    studentsService.addListener(handleStudentsUpdate);
    studentsService.subscribeToChanges(user!.currentProgram!.id);

    return () => {
      studentsService.removeListener(handleStudentsUpdate);
      studentsService.unsubscribeFromChanges();
    };
  }, [user]);

  const fetchStudents = async () => {
    if (studentsLoading) return;
    setStudentsLoading(true);
    try {
      const studentsData = await studentsService.fetchStudents({
        program: user!.currentProgram!.id,
      });

      setStudents(studentsData);
    } catch (error) {
      console.error(error);
    } finally {
      setStudentsLoading(false);
    }
  };

  const exportStudents = async () => {
    if (students) {
      setIsExportLoading(true);

      await exportStudentsToExcel(
        "Students",
        students!.map((response) => {
          return {
            id: response.id,
            fullName: `${response.name} ${response.surname} `,
            email: response.email,
            studentNumber: response.studentNumber,
            cellPhoneNumber: response.cellphoneNumber,
            levelOfStudy: response.levelOfStudy,
            studyProgramme: response.studyProgramme,
          };
        })
      );
      setIsExportLoading(false);
    }
  };

  const createNote = async ({
    title,
    content,
    category,
    student,
    administrator,
  }: {
    title: string;
    content: string;
    category: string;
    student: string;
    administrator: string;
  }) => {
    const newNote: CreateNoteRequest = {
      title: title,
      content: content,
      category: category,
      student: student,
      administrator: administrator,
    };

    setCreateNoteLoading(true);
    try {
      await studentsService.createNote(newNote);
    } catch (error) {
      console.error(error);
    } finally {
      setCreateNoteLoading(false);
    }
  };

  const updateNote = async ({
    originalNote,
    updatedNote,
  }: {
    originalNote: SupportNote;
    updatedNote: Partial<SupportNote>;
  }) => {
    setUpdateNoteLoading(true);
    try {
      await studentsService.updateNote({
        originalNote,
        updatedNote,
      });
    } catch (error) {
      console.error(error);
    } finally {
      setUpdateNoteLoading(false);
    }
  };

  return (
    <StudentsContext.Provider
      value={{
        students,
        studentsLoading,
        updateNoteLoading,
        isExportLoading,
        createNoteLoading,
        exportStudents,
        fetchStudents,
        updateNote,
        createNote,
      }}
    >
      {children}
    </StudentsContext.Provider>
  );
};

export const useStudents = () => {
  const context = useContext(StudentsContext);

  if (!context)
    throw new Error("useStudents must be used within a StudentsProvider");

  return context;
};
