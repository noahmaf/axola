import {
  AxolaUser,
  GetUserProfileRequest,
  PostSwitchProgramRequest,
} from "@/app/models/AxolaUser";
import AxolaError from "@/app/errors/AxolaError";
import { supabase } from "@/api/supabaseClient";
import AxolaProgram from "@/app/models/AxolaProgram";

const userService = {
  async getUserProfile(request: GetUserProfileRequest) {
    const { data: programsData, error: programsError } = await supabase
      .from("administrator_programs")
      .select("program:programs(*)")
      .eq("administrator", request.userId);

    if (programsError) {
      throw new AxolaError(
        "Error fetching user programs",
        "101",
        programsError
      );
    }

    const { data: userDetails, error: userDetailsError } = await supabase
      .from("administrators")
      .select("*")
      .eq("id", request.userId)
      .single();

    if (userDetailsError) {
      throw new AxolaError(
        "Error fetching user defails",
        "101",
        userDetailsError
      );
    }

    const typedProgramsData = programsData as unknown as {
      program: AxolaProgram;
    }[];

    const programs: AxolaProgram[] = typedProgramsData.map((result) => ({
      id: result.program.id,
      university: result.program.university,
      name: result.program.name,
    }));

    const axolaAdminUser: AxolaUser = {
      id: userDetails.id,
      name: userDetails.name,
      surname: userDetails.surname,
      email: userDetails.email,
      cellPhone: userDetails.cell_phone,
      profilePicture: userDetails.profile_picture,
      owner: userDetails.owner,
      currentProgram:
        programs.find(
          (program) => program.id === userDetails.current_program
        ) ?? null,
      programs: programs,
    };

    return axolaAdminUser;
  },

  async switchProgram(request: PostSwitchProgramRequest) {
    const { data, error } = await supabase
      .from("administrators")
      .update({ current_program: request.newProgram })
      .eq("id", request.userId);

    if (error) {
      throw new AxolaError("Error updating user program", "101", error);
    }

    return data;
  },
};

export default userService;
