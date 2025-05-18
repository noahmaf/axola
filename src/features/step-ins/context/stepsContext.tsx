import { useAuth } from "@/app/context/authContext";
import { CreateStepRequest, Step, StepResponse } from "@/app/models/Step";
import { StepForm } from "@/app/models/StepForm";
import announcementsService from "@/app/services/announcementsService";
import stepsService from "@/app/services/stepsService";

import {
  useState,
  useEffect,
  useContext,
  createContext,
  ReactNode,
} from "react";

type CreateStepParams = {
  title: string;
  description: string;
  image: any;
  form: string;
  studyLevel: string;
  studyProgram: string;
};

type DeleteStepParams = { id: string };

type UpdateStepParams = {
  originalStep: Step;
  updatedStep: Partial<Step>;
};

const StepsContext = createContext<{
  studyLevels: string[];
  studyProgrammes: string[];
  steps: Step[];
  currentStep?: Step;
  currentStepResponses?: StepResponse[];
  forms: StepForm[];
  createStepLoading: boolean;
  deleteStepLoading: boolean;
  updateStepLoading: boolean;
  stepsLoading: boolean;
  stepLoading: boolean;
  viewStep: (id: string) => Promise<void>;
  fetchSteps: () => Promise<void>;
  createStep: ({
    title,
    description,
    image,
    form,

    studyLevel,
    studyProgram,
  }: CreateStepParams) => Promise<void>;
  deleteStep: ({ id }: DeleteStepParams) => Promise<void>;
  updateStep: ({
    originalStep,
    updatedStep,
  }: UpdateStepParams) => Promise<void>;
}>({
  steps: [],
  forms: [],
  studyLevels: [],
  studyProgrammes: [],
  currentStepResponses: [],
  createStepLoading: false,
  deleteStepLoading: false,
  updateStepLoading: false,
  stepsLoading: true,
  stepLoading: true,
  fetchSteps: async () => {},
  createStep: async () => {},
  deleteStep: async () => {},
  updateStep: async () => {},
  viewStep: async () => {},
});

export const StepsProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [steps, setSteps] = useState<Step[]>([]);
  const [studyLevels, setStudyLevels] = useState<string[]>([]);
  const [studyProgrammes, setStudyProgrammes] = useState<string[]>([]);
  const [step, setStep] = useState<Step>();
  const [currentStepResponses, setCurrentStepResponses] =
    useState<StepResponse[]>();
  const [forms, setForms] = useState<StepForm[]>([]);
  const [createStepLoading, setCreateStepLoading] = useState<boolean>(false);
  const [deleteStepLoading, setDeleteStepLoading] = useState<boolean>(false);
  const [updateStepLoading, setUpdateStepLoading] = useState<boolean>(false);
  const [stepsLoading, setStepsLoading] = useState<boolean>(false);
  const [stepLoading, setStepLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!user || !user!.currentProgram) return;

    fetchSteps();

    // Subscribe to real-time updates
    const handleStepsUpdate = (
      updatedSteps: Step[],
      updatedForms: StepForm[],
      updatedStepResponses?: StepResponse[]
    ) => {
      setSteps(updatedSteps);
      setForms(updatedForms);
      setCurrentStepResponses(updatedStepResponses);
    };

    stepsService.addListener(handleStepsUpdate);
    stepsService.subscribeToChanges(user!.currentProgram!.id);

    return () => {
      stepsService.removeListener(handleStepsUpdate);
      stepsService.unsubscribeFromChanges();
    };
  }, [user]);

  const fetchSteps = async () => {
    if (stepsLoading) return;
    setStepsLoading(true);
    try {
      const levels = await announcementsService.fetchStudyLevels(user!);
      const programmes = await announcementsService.fetchStudyProgrammes(user!);
      const formsData = await stepsService.fetchForms({
        program: user!.currentProgram!.id,
      });
      const stepsData = await stepsService.fetchSteps({
        program: user!.currentProgram!.id,
      });
      setForms(formsData);
      setSteps(stepsData);
      setStudyLevels(levels);
      setStudyProgrammes(programmes);
    } catch (error) {
      console.error(error);
    } finally {
      setStepsLoading(false);
    }
  };

  const viewStep = async (step: string) => {
    if (stepLoading) return;
    setStepLoading(true);
    try {
      const fetchedStepResponses = await stepsService.fethStepResponses({
        step: step,
      });
      setStep(steps.find((loadedStep) => loadedStep.id === step));
      setCurrentStepResponses(fetchedStepResponses);
    } catch (error) {
      console.error(error);
    } finally {
      setStepLoading(false);
    }
  };

  const createStep = async ({
    title,
    description,
    image,
    form,
  }: CreateStepParams) => {
    if (!user && !user!.currentProgram) return;
    setCreateStepLoading(true);

    const newStep: CreateStepRequest = {
      title,
      description,
      image,
      form,
      program: user!.currentProgram!.id,
    };

    try {
      await stepsService.postNewStep(newStep);
    } catch (error) {
      console.error(error);
    } finally {
      setCreateStepLoading(false);
    }
  };

  const deleteStep = async ({ id }: DeleteStepParams) => {
    setDeleteStepLoading(true);
    try {
      await stepsService.deleteStep({ id });
    } catch (error) {
      console.error(error);
    } finally {
      setDeleteStepLoading(false);
    }
  };

  const updateStep = async ({
    originalStep,
    updatedStep,
  }: UpdateStepParams) => {
    setUpdateStepLoading(true);
    try {
      originalStep;
      updatedStep;
      // await stepsService.updateStep({
      //   originalStep,
      //   updatedStep,
      // });
    } catch (error) {
      console.error(error);
    } finally {
      setUpdateStepLoading(false);
    }
  };

  return (
    <StepsContext.Provider
      value={{
        studyLevels,
        studyProgrammes,
        stepLoading,
        steps,
        forms,
        currentStepResponses,
        currentStep: step,
        createStep,
        updateStep,
        deleteStep,
        viewStep,
        fetchSteps,
        stepsLoading,
        createStepLoading,
        updateStepLoading,
        deleteStepLoading,
      }}
    >
      {children}
    </StepsContext.Provider>
  );
};

export const useSteps = () => {
  const context = useContext(StepsContext);

  if (!context) throw new Error("useSteps must be used within a StepsProvider");

  return context;
};
