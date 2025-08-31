import { supabase } from "@/api/supabaseClient";
import {
  AxolaStudent,
  FetchStudentInfoRequest,
  FetchStudentsRequest,
} from "../models/AxolaStudent";
import { SupportChat, SupportNote } from "../models/SupportChat";
import { StepResponse } from "../models/Step";
import { CreateNoteRequest, UpdateNoteRequest } from "../models/Announcement";

const studentsService = {
  students: [] as AxolaStudent[],

  listeners: [] as ((students: AxolaStudent[]) => void)[],
  studentsChannel: null as ReturnType<typeof supabase.channel> | null,

  async fetchStudents(fetchStudentsRequest: FetchStudentsRequest) {
    const { data, error } = await supabase
      .from("students")
      .select("*,program:programs(*)")
      .eq("program", fetchStudentsRequest.program)
      .order("created_at", { ascending: false });


    if (error) throw error;

    const formattedStudents: AxolaStudent[] = (data || []).map((student) => {
      return {
        id: student.id,
        cellphoneNumber: student.cellphone_number,
        levelOfStudy: student.level_of_study,
        studyProgramme: student.study_programme,
        studentNumber: student.student_number,
        email: student.email,
        name: student.name,
        surname: student.surname,
        profilePicture: student.profile_picture,
        program: {
          id: student.program.id,
          name: student.program.name,
          university: student.program.university,
        },
        university: student.university,
      };
    });

    studentsService.students = formattedStudents;
    studentsService.notifyListeners();

    return formattedStudents;
  },

  async fetchStudentInfo(fetchStudentInfoRequest: FetchStudentInfoRequest) {
    const { data, error } = await supabase
      .from("students")
      .select(
        `
        chats(*,latest_message:chat_messages!chats_latest_message_fkey(*),program:programs(*),user:students(*)),
        steps:student_steps(*,step:step_ins(*),student:students(*,program:programs(*))),
        notes(*)
        `
      )
      .eq("id", fetchStudentInfoRequest.student)
      .single();

    if (error) throw error;
    return {
      chats:
        data.chats.length !== 0
          ? (data.chats.map((chat) => {
              return {
                id: chat.id,
                dateCreated: chat.created_at,
                dateUpdated: chat.updated_at,
                title: chat.title,
                user: {
                  id: chat.user.id,
                  program: {
                    id: chat.program.id,
                    university: chat.user.university,
                    name: chat.program.name,
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
                category: chat.category,
                status: chat.status,
                latestMessage: {
                  id: chat.latest_message.id,
                  chat: chat.latest_message.chat,
                  dateCreated: chat.latest_message.created_at,
                  content: chat.latest_message.content,
                  student: chat.latest_message.student,
                  administrator: chat.latest_message.administrator,
                  sent:
                    chat.latest_message.student === null &&
                    chat.latest_message.administrator !== null,
                  read: chat.latest_message.read,
                },
                program: chat.program.id,
              };
            }) as SupportChat[])
          : [],
      steps:
        data.steps.length !== 0
          ? (data.steps.map((stepResponse) => {
              return {
                id: stepResponse.id,
                step: stepResponse.step,
                stepInfo: {
                  id: stepResponse.step.id,
                  title: stepResponse.step.title,
                  description: stepResponse.step.description,
                  form: stepResponse.step.form,
                  image: stepResponse.step.image,
                  date: stepResponse.step.created_at,
                  program: stepResponse.step.program,
                },
                student: {
                  id: stepResponse.student.id,
                  program: {
                    id: stepResponse.student.program.id,
                    name: stepResponse.student.program.name,
                    university: stepResponse.student.program.university,
                  },
                  name: stepResponse.student.name,
                  surname: stepResponse.student.surname,
                  email: stepResponse.student.email,
                  studentNumber: stepResponse.student.student_number,
                  university: stepResponse.student.university,
                  profilePicture: stepResponse.student.profile_picture,
                  levelOfStudy: stepResponse.student.level_of_study,
                  studyProgramme: stepResponse.student.study_programme,
                  cellphoneNumber: stepResponse.student.cellphone_number,
                  whatsappNumber: stepResponse.student.whatsapp_number,
                },
                response: stepResponse.response,
                submitDate: stepResponse.created_at,
              };
            }) as StepResponse[])
          : [],
      notes:
        data.notes.length !== 0
          ? data.notes.map((note) => {
              return {
                id: note.id,
                createdAt: note.created_at,
                updatedAt: note.updated_at,
                title: note.title,
                content: note.content,
                category: note.category,
                student: note.student,
                administrator: note.administrator,
                program: note.program,
              };
            })
          : [],
    };
  },

  async updateNote(updateNoteRequest: UpdateNoteRequest) {
    let changes: Partial<SupportNote> = {};
    for (const key in updateNoteRequest.originalNote) {
      if (
        updateNoteRequest.updatedNote[key as keyof SupportNote] !==
        updateNoteRequest.originalNote[key as keyof SupportNote]
      ) {
        changes[key as keyof SupportNote] =
          updateNoteRequest.updatedNote[key as keyof SupportNote];
      }
    }

    const { data, error } = await supabase
      .from("notes")
      .update({ ...changes, updated_at: new Date().toISOString() })
      .eq("id", updateNoteRequest.originalNote.id);
    if (error) throw error;
    return data;
  },

  async createNote(createNoteRequest: CreateNoteRequest) {
    const { data, error } = await supabase
      .from("notes")
      .insert(createNoteRequest);
    if (error) throw error;
    return data;
  },

  subscribeToChanges(program: string) {
    if (studentsService.studentsChannel) return;

    studentsService.studentsChannel = supabase.channel("public:students");

    studentsService.studentsChannel.on(
      "postgres_changes",
      { event: "INSERT", schema: "public", table: "students" },
      (payload) => {
        if (payload.new.program === program) {
          studentsService.students = [
            {
              id: payload.new.id,
              cellphoneNumber: payload.new.cellphone_number,

              levelOfStudy: payload.new.level_of_study,
              studyProgramme: payload.new.study_programme,
              studentNumber: payload.new.student_number,
              email: payload.new.email,
              name: payload.new.name,
              surname: payload.new.surname,
              profilePicture: payload.new.profile_picture,
              program: {
                id: payload.new.program.id,
                name: payload.new.program.name,
                university: payload.new.program.university,
              },
              university: payload.new.university,
            },
            ...studentsService.students,
          ];

          studentsService.notifyListeners();
        }
      }
    );

    studentsService.studentsChannel.on(
      "postgres_changes",
      { event: "UPDATE", schema: "public", table: "students" },
      (payload) => {
        if (payload.new.program === program) {
          studentsService.students = studentsService.students.map((student) =>
            student.id === payload.new.id
              ? ({
                  id: payload.new.id,
                  cellphoneNumber: payload.new.cellphone_number,

                  levelOfStudy: payload.new.level_of_study,
                  studyProgramme: payload.new.study_programme,
                  studentNumber: payload.new.student_number,
                  email: payload.new.email,
                  name: payload.new.name,
                  surname: payload.new.surname,
                  profilePicture: payload.new.profile_picture,
                  program: {
                    id: payload.new.program.id,
                    name: payload.new.program.name,
                    university: payload.new.program.university,
                  },
                  university: payload.new.university,
                } as AxolaStudent)
              : student
          );

          studentsService.notifyListeners();
        }
      }
    );

    studentsService.studentsChannel.on(
      "postgres_changes",
      { event: "DELETE", schema: "public", table: "students" },
      (payload) => {
        studentsService.students = studentsService.students.filter(
          (student) => student.id !== payload.old.id
        );

        studentsService.notifyListeners();
      }
    );

    studentsService.studentsChannel.subscribe();
  },
  unsubscribeFromChanges() {
    if (
      studentsService.studentsChannel &&
      studentsService.listeners.length === 0
    ) {
      studentsService.studentsChannel.unsubscribe();
      supabase.removeChannel(studentsService.studentsChannel);
      studentsService.studentsChannel = null;
    }
  },
  addListener(listener: (students: AxolaStudent[]) => void) {
    studentsService.listeners.push(listener);
    listener(studentsService.students);
  },
  removeListener(listener: (students: AxolaStudent[]) => void) {
    studentsService.listeners = studentsService.listeners.filter(
      (l) => l != listener
    );
  },
  notifyListeners() {
    studentsService.listeners.forEach((listener) => {
      listener(studentsService.students);
    });
  },
};

export default studentsService;
