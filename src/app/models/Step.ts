import { AxolaStudent } from "./AxolaStudent";

export interface Step {
  id: string;
  title: string;
  description: string;
  form: string;
  image: string;
  date: string;
  program: string;
}

export interface FetchStepsRequest {
  program: string;
}

export interface FetchStepResponsesRequest {
  step: string;
}

export interface StepResponse {
  id: string;
  step: string;
  stepInfo: Step;
  student: AxolaStudent;
  response: any;
  submitDate: string;
}

export interface CreateStepRequest {
  title: string;
  description: string;
  form: string;
  image: any;
  program: string;
}

export interface CreateStepSchema {
  title: string;
  description: string;
  form: string;
  image: any;
  study_level: string;
  study_programme: string;
}

export interface UpdateStepSchema {
  title: string;
  description: string;
  form: string;
  image: string;
}

export interface ReferChatSchema {
  referralNotes: string;
  referralAdmin: string;
}

export interface UpdateStepRequest {
  originalStep: Step;
  updatedStep: Partial<Step>;
}

export interface DeleteStepRequest {
  id: string;
}

export interface UploadStepImageRequest {
  title: string;
  file: any;
}
