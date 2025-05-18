import { Step, UpdateStepSchema } from "@/app/models/Step";
import { useNavigate } from "react-router-dom";
import { useSteps } from "../context/stepsContext";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import CircularLoadingSpinner from "@/components/CircularLoadingSpinner";
import { forwardRef, useRef, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Controller, useForm } from "react-hook-form";
import { MdEditSquare } from "react-icons/md";
import { Trash2, UploadCloud } from "lucide-react";

// Custom Select Wrapper with forwardRef
const SelectWrapper = forwardRef<HTMLButtonElement, any>((props, ref) => (
  <Select {...props}>
    <SelectTrigger id="category" ref={ref} className="w-full select-input">
      <SelectValue placeholder="Select step type" />
    </SelectTrigger>
    <SelectContent>{props.children}</SelectContent>
  </Select>
));

SelectWrapper.displayName = "SelectWrapper";

const StepCard = ({ step }: { step: Step }) => {
  const navigate = useNavigate();

  const handleCardTap = () => {
    navigate(`/step-ins/view`, {
      state: step,
    });
  };

  const [editStepDialog, setEditStep] = useState<boolean>(false);
  const [deleteStepDialog, setDeleteStep] = useState<boolean>(false);
  const [stepForm, setStepForm] = useState<string>("");
  const [stepImage, setStepImage] = useState<string>(step.image);
  const {
    forms,
    deleteStep,
    deleteStepLoading,
    updateStep,
    updateStepLoading,
  } = useSteps();

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // React Hook Form setup
  const { register, handleSubmit, setValue, reset, control } =
    useForm<UpdateStepSchema>();

  const editStepDialogActionClick = (updateEditStep: boolean) => {
    setDeleteStep(false);
    setValue("description", step.description);
    setValue("title", step.title);
    setValue("form", step.form);
    setStepImage(step.image);
    setEditStep(updateEditStep);
  };

  const deleteStepDialogActionClick = (updateDeleteStep: boolean) => {
    setEditStep(false);
    setDeleteStep(updateDeleteStep);
  };

  const cancelStepDelete = () => {
    deleteStepDialogActionClick(false);
  };

  const cancelStepEdit = () => {
    reset({
      title: "",
      description: "",
      form: "",
      image: "",
    });
    setStepForm("");
    setStepImage("");
    editStepDialogActionClick(false);
  };

  const confirmDelete = async () => {
    if (deleteStepLoading) return;
    await deleteStep({ id: step.id });
  };

  const confirmUpdate = async (data: UpdateStepSchema) => {
    if (updateStepLoading) return;

    await updateStep({
      originalStep: step,
      updatedStep: data,
    });
  };

  const handleStepFormChange = (selectedOption: string) => {
    setStepForm(selectedOption);
    setValue("form", stepForm);
  };

  const handleStepImageChange = (e: any) => {
    const file = e.target.files?.[0];
    setStepImage(file ? URL.createObjectURL(file) : "");
    setValue("image", file);
  };

  const handleFilePicker = () => {
    fileInputRef.current?.click();
  };

  return (
    <AlertDialog>
      <div
        onClick={handleCardTap}
        className="  bg-white  cursor-pointer  w-full flex  items-center h-fit"
      >
        <img
          src={step.image}
          className="rounded-lg h-full object-contain w-[150px] shadow-sm text-white "
        />

        <div className=" flex flex-col gap-1 rounded-md shadow-sm p-4 h-full w-full select-none">
          <div className="flex items-center justify-between ">
            <p className="text-base font-semibold">{step.title}</p>
            <div className=" flex ">
              <AlertDialogTrigger asChild>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    editStepDialogActionClick(true);
                  }}
                  className="h-10 w-10 text-gray-500 hover:text-secondary hover:bg-secondary rounded-full hover:bg-opacity-10  flex items-center justify-center"
                >
                  <MdEditSquare className="h-5 w-5" />
                </button>
              </AlertDialogTrigger>

              <AlertDialogTrigger asChild>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteStepDialogActionClick(true);
                  }}
                  className=" h-10 w-10  text-red-500 hover:bg-red-500 rounded-full hover:bg-opacity-10 flex items-center justify-center"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </AlertDialogTrigger>
            </div>
          </div>

          <p className="text-sm text-slate-700 font-medium line-clamp-2">
            {step.description}
          </p>

          <div className="flex items-center space-x-1">
            <p className="text-sm font-semibold text-orange-500">Form:</p>
            <span className="text-sm font-semibold text-secondary line-clamp-1">
              {forms.find((form) => form.id === step.form)?.title}
            </span>
          </div>

          <div className="flex items-center space-x-1">
            <p className="text-sm font-semibold text-orange-500">
              Date Created:
            </p>
            <p className="text-sm  text-slate-700 font-medium">{step.date}</p>
          </div>
        </div>
      </div>

      {editStepDialog && (
        <AlertDialogContent className="text-black h-[85%] overflow-y-auto">
          <AlertDialogHeader>
            <AlertDialogTitle>Edit step</AlertDialogTitle>
            <AlertDialogDescription className="space-y-4">
              All changes wiwll not be saved until you submit. Once submitted
              the changes will be sent to the students.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <form id="edit-step-form" onSubmit={handleSubmit(confirmUpdate)}>
            <div className="flex flex-col items-start">
              <label htmlFor="title" className="default-label">
                Title
              </label>
              <input
                type="text"
                id="title"
                placeholder="e.g Exam preparation"
                className="block w-full new-step-input"
                {...register("title")}
              />
            </div>
            <div className="flex flex-col items-start">
              <label htmlFor="description" className="default-label">
                Description
              </label>
              <textarea
                id="description"
                className="w-full new-step-input resize-none"
                placeholder="Enter description here... Keep it short"
                {...register("description")}
              />
            </div>

            <div className="flex flex-col items-start w-full">
              <label htmlFor="form" className="default-label">
                Step form
              </label>
              <Controller
                name="form"
                control={control}
                rules={{ required: "Step form is required" }}
                render={({ field }) => (
                  <SelectWrapper
                    {...field}
                    onValueChange={handleStepFormChange}
                  >
                    {forms.map((form) => (
                      <SelectItem key={form.id} value={form.id}>
                        {form.title}
                      </SelectItem>
                    ))}
                  </SelectWrapper>
                )}
              />
            </div>
            <div className="flex flex-col w-full justify-start items-start">
              <label htmlFor="image" className="default-label">
                Picture
              </label>
              <input
                id="image"
                type="file"
                accept="image/*"
                className="hidden"
                {...register("image", {
                  onChange: handleStepImageChange,
                })}
                ref={fileInputRef}
              />
              <div className="flex items-center space-x-4">
                {stepImage && (
                  <img
                    src={stepImage}
                    alt="Step image"
                    className="object-contain  h-[200px] "
                  />
                )}
                <button className="circle-button" onClick={handleFilePicker}>
                  <UploadCloud />
                </button>
              </div>
            </div>
          </form>

          <AlertDialogFooter>
            <AlertDialogCancel
              className="min-w-[100px]"
              onClick={cancelStepEdit}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              type="submit"
              form="edit-step-form"
              className="min-w-[100px] bg-secondary hover:bg-secondary hover:bg-opacity-85 text-white"
            >
              {updateStepLoading && (
                <CircularLoadingSpinner
                  className="flex items-center w-full justify-center"
                  color="white"
                />
              )}
              <p>Update Step</p>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      )}

      {deleteStepDialog && (
        <AlertDialogContent className="text-black">
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm step deletion?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete the selected step? This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={cancelStepDelete}
              className="min-w-[100px]"
              disabled={deleteStepLoading}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              disabled={deleteStepLoading}
              onClick={confirmDelete}
              className="bg-red-500 text-white hover:bg-red-400 min-w-[100px] flex"
            >
              {deleteStepLoading && (
                <CircularLoadingSpinner
                  className="flex items-center w-full justify-center"
                  color="white"
                />
              )}
              <p>Delete Step</p>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      )}
    </AlertDialog>
  );
};

export default StepCard;
