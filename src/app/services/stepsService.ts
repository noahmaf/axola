import { supabase } from "@/api/supabaseClient";
import {
  CreateStepRequest,
  DeleteStepRequest,
  FetchStepResponsesRequest,
  FetchStepsRequest,
  Step,
  StepResponse,
  // UpdateStepRequest,
  UploadStepImageRequest,
} from "@/app/models/Step";
import { FetchStepFormsRequest, StepForm } from "@/app/models/StepForm";
import { formatDateTime } from "@/app/utils/dateFormat";

const stepsService = {
  steps: [] as Step[],
  currentStepResponses: [] as StepResponse[],
  forms: [] as StepForm[],
  listeners: [] as ((
    steps: Step[],
    forms: StepForm[],
    stepResponses?: StepResponse[]
  ) => void)[],
  stepsChannel: null as ReturnType<typeof supabase.channel> | null,
  formsChannel: null as ReturnType<typeof supabase.channel> | null,

  async fetchForms(fetchStepFormsRequest: FetchStepFormsRequest) {
    const { data, error } = await supabase
      .from("forms")
      .select("*")
      .eq("program", fetchStepFormsRequest.program)
      .order("created_at", { ascending: false });

    if (error) throw error;

    const formattedForms: StepForm[] = (data || []).map((form) => ({
      id: form.id,
      title: form.title,
    }));

    stepsService.forms = formattedForms;
    stepsService.notifyListeners();

    return formattedForms;
  },

  async fetchSteps(fetchStepsRequest: FetchStepsRequest) {
    const { data, error } = await supabase
      .from("step_ins")
      .select("*")
      .eq("program", fetchStepsRequest.program)
      .order("created_at", { ascending: false });

    if (error) throw error;

    const formattedSteps: Step[] = (data || []).map((step) => {
      return {
        id: step.id,
        title: step.title,
        description: step.description,
        date: formatDateTime(step.created_at),
        form: step.form,
        program: step.program,
        image: step.image,
      };
    });

    stepsService.steps = formattedSteps;
    stepsService.notifyListeners();

    return formattedSteps;
  },

  async fethStepResponses(request: FetchStepResponsesRequest) {
    const { data, error } = await supabase
      .from("student_steps")
      .select("*,student:students(*)")
      .eq("step", request.step)
      .order("created_at", { ascending: false });

    if (error) throw error;

    const formattedStepResponses: StepResponse[] = (data || []).map(
      (response) => {
        return {
          id: response.id,
          student: {
            id: response.student.id,
            program: response.student.program,
            name: response.student.name,
            surname: response.student.surname,
            email: response.student.email,
            studentNumber: response.student.student_number,
            university: response.student.university,
            profilePicture: response.student.profile_picture,
            levelOfStudy: response.student.level_of_study,
            studyProgramme: response.student.study_programme,
          },
          submitDate: formatDateTime(response.created_at),
          step: response.step,
          response: response.response,
          stepInfo: {
            id: "",
            image: "",
            title: "",
            description: "",
            form: "",
            date: "",
            program: "",
          },
        };
      }
    );

    stepsService.currentStepResponses = formattedStepResponses;
    stepsService.notifyListeners();

    return formattedStepResponses;
  },

  async postNewStep(postNewStepRequest: CreateStepRequest) {
    try {
      const imageUrl = await stepsService.uploadStepImage({
        file: postNewStepRequest.image,
        title: postNewStepRequest.title,
      });
      const { data, error } = await supabase.from("step_ins").insert({
        title: postNewStepRequest.title,
        image: imageUrl,
        form: postNewStepRequest.form,
        description: postNewStepRequest.description,
        program: postNewStepRequest.program,
      });

      if (error) throw error;

      return data;
    } catch (err) {
      console.error("Error creating step:", err);
      throw err;
    }
  },

  // async updateStep(updateStepRequest: UpdateStepRequest) {},

  async deleteStep(deleteStepRequest: DeleteStepRequest) {
    const { data, error } = await supabase
      .from("step_ins")
      .delete()
      .eq("id", deleteStepRequest.id);
    if (error) throw error;
    return data;
  },

  async uploadStepImage(uploadStepImageRequest: UploadStepImageRequest) {
    const fileExt = uploadStepImageRequest.file.name.split(".").pop();
    const fileName = `${uploadStepImageRequest.title
      .toLowerCase()
      .replace(/\s+/g, "_")}_step_${Math.random()}.${fileExt}`;
    const filePath = `steps/${fileName}`;
    const { error } = await supabase.storage
      .from("axola-storage")
      .upload(filePath, uploadStepImageRequest.file);
    if (error) throw error;

    const {
      data: { publicUrl },
    } = supabase.storage.from("axola-storage").getPublicUrl(filePath);

    return publicUrl;
  },

  subscribeToChanges(program: string) {
    if (stepsService.formsChannel && stepsService.stepsChannel) return;

    stepsService.formsChannel = supabase.channel("public:forms");
    stepsService.stepsChannel = supabase.channel("public:step_ins");

    stepsService.formsChannel.on(
      "postgres_changes",
      { event: "INSERT", schema: "public", table: "forms" },
      (payload) => {
        if (payload.new.program === program) {
          stepsService.forms = [
            {
              id: payload.new.id,
              title: payload.new.title,
            },
            ...stepsService.forms,
          ];

          stepsService.notifyListeners();
        }
      }
    );

    stepsService.stepsChannel.on(
      "postgres_changes",
      { event: "INSERT", schema: "public", table: "step_ins" },
      (payload) => {
        if (payload.new.program === program) {
          stepsService.steps = [
            {
              id: payload.new.id,
              title: payload.new.title,
              description: payload.new.description,
              image: payload.new.image,
              form: payload.new.form,
              date: formatDateTime(payload.new.created_at),
              program: payload.new.program,
            },
            ...stepsService.steps,
          ];

          stepsService.notifyListeners();
        }
      }
    );

    stepsService.formsChannel.on(
      "postgres_changes",
      { event: "UPDATE", schema: "public", table: "forms" },
      (payload) => {
        if (payload.new.program === program) {
          stepsService.forms = stepsService.forms.map((form) =>
            form.id === payload.new.id
              ? ({
                  id: payload.new.id,
                  title: payload.new.title,
                } as StepForm)
              : form
          );

          stepsService.notifyListeners();
        }
      }
    );

    stepsService.stepsChannel.on(
      "postgres_changes",
      { event: "UPDATE", schema: "public", table: "step_ins" },
      (payload) => {
        if (payload.new.program === program) {
          stepsService.steps = stepsService.steps.map((step) =>
            step.id === payload.new.id
              ? ({
                  id: payload.new.id,
                  title: payload.new.title,
                  description: payload.new.description,
                  date: formatDateTime(payload.new.created_at),
                  form: payload.new.form,
                  program: payload.new.program,
                } as Step)
              : step
          );

          stepsService.notifyListeners();
        }
      }
    );

    stepsService.formsChannel.on(
      "postgres_changes",
      { event: "DELETE", schema: "public", table: "forms" },
      (payload) => {
        stepsService.forms = stepsService.forms.filter(
          (form) => form.id !== payload.old.id
        );

        stepsService.notifyListeners();
      }
    );

    stepsService.stepsChannel.on(
      "postgres_changes",
      { event: "DELETE", schema: "public", table: "step_ins" },
      (payload) => {
        stepsService.steps = stepsService.steps.filter(
          (step) => step.id !== payload.old.id
        );

        stepsService.notifyListeners();
      }
    );

    stepsService.formsChannel.subscribe();
    stepsService.stepsChannel.subscribe();
  },
  unsubscribeFromChanges() {
    if (stepsService.stepsChannel && stepsService.listeners.length === 0) {
      stepsService.stepsChannel.unsubscribe();
      supabase.removeChannel(stepsService.stepsChannel);
      stepsService.stepsChannel = null;
    }

    if (stepsService.formsChannel && stepsService.listeners.length === 0) {
      stepsService.formsChannel.unsubscribe();
      supabase.removeChannel(stepsService.formsChannel);
      stepsService.formsChannel = null;
    }
  },
  addListener(
    listener: (
      steps: Step[],
      forms: StepForm[],
      stepResponses?: StepResponse[]
    ) => void
  ) {
    stepsService.listeners.push(listener);
    listener(
      stepsService.steps,
      stepsService.forms,
      stepsService.currentStepResponses
    );
  },
  removeListener(
    listener: (
      steps: Step[],
      forms: StepForm[],
      stepResponses?: StepResponse[]
    ) => void
  ) {
    stepsService.listeners = stepsService.listeners.filter(
      (l) => l != listener
    );
  },
  notifyListeners() {
    stepsService.listeners.forEach((listener) => {
      listener(
        stepsService.steps,
        stepsService.forms,
        stepsService.currentStepResponses
      );
    });
  },
};

export default stepsService;
