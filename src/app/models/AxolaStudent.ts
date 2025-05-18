import AxolaProgram from "@/app/models/AxolaProgram";
import { SupportChat, SupportNote } from "./SupportChat";
import { StepResponse } from "./Step";

export interface AxolaStudent {
  id: string;
  program: AxolaProgram;
  name: string;
  surname: string;
  email: string;
  studentNumber: string;
  university: string;
  profilePicture: string;
  levelOfStudy: string;
  studyProgramme: string;
  cellphoneNumber?: string;
  whatsappNumber?: string;
}

export interface AxolaStudentInfo {
  chats: SupportChat[];
  steps: StepResponse[];
  notes: SupportNote[];
}

export interface AxolaStudentActivity {
  id: string;
  user_id: string;
  action: string;
  timestamp: string;
}

export interface AxolaStudentStepResponse {
  fullName: string;
  email: string;
  id: string;
  studentNumber: string;
  submissionDate: string;
  response: any;
}

export interface FetchStudentsRequest {
  program: string;
}

export interface FetchStudentInfoRequest {
  student: string;
}
