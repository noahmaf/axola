import AxolaProgram from "./AxolaProgram";

export interface AxolaUser {
  id: string;
  name: string;
  surname: string;
  email: string | null;
  cellPhone: string | null;
  profilePicture: string | null;
  owner: boolean;
  currentProgram: AxolaProgram | null;
  programs: AxolaProgram[];
}

export interface GetUserProfileRequest {
  userId: string;
}

export interface PostSwitchProgramRequest {
  userId: string;
  newProgram: string;
}
