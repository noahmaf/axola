import { forwardRef, useState } from "react";
import { HiOutlinePencilAlt } from "react-icons/hi";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
  SelectItem,
} from "@/components/ui/select";
import { useSteps } from "../context/stepsContext";
import { CreateStepSchema } from "@/app/models/Step";
import { Controller, FieldError, useForm } from "react-hook-form";
import CircularLoadingSpinner from "@/components/CircularLoadingSpinner";

// Custom Select Wrapper with forwardRef
const SelectWrapper = forwardRef<HTMLButtonElement, any>((props, ref) => (
  <Select {...props}>
    <SelectTrigger id="category" ref={ref} className="w-full select-input">
      <SelectValue placeholder="Select step form" />
    </SelectTrigger>
    <SelectContent>{props.children}</SelectContent>
  </Select>
));

const StudyLevelSelectWrapper = forwardRef<HTMLButtonElement, any>(
  (props, ref) => (
    <Select {...props}>
      <SelectTrigger id="study-level" ref={ref} className="w-full select-input">
        <SelectValue placeholder="Select study level" />
      </SelectTrigger>
      <SelectContent>{props.children}</SelectContent>
    </Select>
  )
);

const StudyProgramSelectWrapper = forwardRef<HTMLButtonElement, any>(
  (props, ref) => (
    <Select {...props}>
      <SelectTrigger
        id="study-program"
        ref={ref}
        className="w-full select-input"
      >
        <SelectValue placeholder="Select study program" />
      </SelectTrigger>
      <SelectContent>{props.children}</SelectContent>
    </Select>
  )
);

const NewStepIn = () => {
  const {
    forms,
    studyLevels,
    studyProgrammes,
    createStep,
    createStepLoading,
    stepsLoading,
  } = useSteps();
  // const [stepForm, setStepForm] = useState(null);
  const [stepImage, setStepImage] = useState<string>();

  // React Hook Form setup
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    control,
    formState: { errors },
  } = useForm<CreateStepSchema>();

  const handleStepFormChange = (selectedOption: any) => {
    setValue("form", selectedOption);
  };

  const handleStudyLevelChange = (selectedOption: string) => {
    setValue("study_level", selectedOption);
  };

  const handleStudyProgrammeChange = (selectedOption: string) => {
    setValue("study_programme", selectedOption);
  };

  const publishStep = async (data: CreateStepSchema) => {
    try {
      await createStep({
        title: data.title,
        description: data.description,
        form: data.form,
        image: data.image,
        studyLevel: data.study_level,
        studyProgram: data.study_programme,
      });

      reset({
        title: "",
        description: "",
        form: "",
        image: undefined,
        study_level: "",
        study_programme: "",
      });

      setStepImage(undefined);
    } catch (e) {}
  };

  return stepsLoading ? (
    <div className="w-full shadow-xl bg-white rounded-md p-4  text-transparent select-none animate-pulse">
      <div className="flex items-start gap-4 justify-between">
        <div className="flex flex-col items-start space-y-2 w-full">
          <p className="font-semibold text-lg bg-secondary bg-opacity-20 rounded-md">
            ______________________
          </p>
          <div className="w-full flex flex-col">
            <p className="text-sm w-full bg-secondary bg-opacity-20 rounded-t-md rounded-br-md">
              _________________________________________________
            </p>
            <p className="text-sm  bg-secondary bg-opacity-20 rounded-b-md w-fit">
              _________________________________________________
            </p>
          </div>
        </div>
      </div>
      <div className="mt-6 flex flex-col gap-4">
        {/* Title */}
        <div className="flex flex-col items-start space-y-1">
          <div className="d bg-secondary bg-opacity-20 text-transparent rounded-md">
            _________________
          </div>

          <div className="default-label bg-secondary bg-opacity-20 text-transparent p-2 w-full rounded-md">
            _
          </div>
        </div>

        {/* Description */}
        <div className="flex flex-col items-start space-y-1">
          <div className=" bg-secondary bg-opacity-20 text-transparent rounded-md">
            _________________
          </div>

          <div className="default-label bg-secondary bg-opacity-20 text-transparent p-2 w-full rounded-md ">
            <p>____________</p>
            <p>____________</p>
            <p>____________</p>
          </div>
        </div>

        {/* Step Form */}
        <div className="flex flex-col items-start space-y-1">
          <div className=" bg-secondary bg-opacity-20  rounded-md ">
            _________________
          </div>

          <div className=" bg-secondary bg-opacity-20 text-transparent p-2 w-full rounded-md">
            _
          </div>
        </div>

        {/* Step Image */}
        <div className="flex flex-col items-start space-y-1">
          <div className=" bg-secondary bg-opacity-20  rounded-md ">
            _________________
          </div>

          <div className=" bg-secondary bg-opacity-20 text-transparent p-2 w-full rounded-md">
            _
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <div
            className={`min-w-[170px]
h-[40px] rounded-md   mt-6 bg-secondary bg-opacity-20 flex items-center justify-center space-x-2 text-transparent`}
          >
            _____
          </div>
        </div>
      </div>
    </div>
  ) : (
    <form
      onSubmit={handleSubmit(publishStep)}
      className="mt-6 flex flex-col gap-4"
    >
      <div className="w-full shadow-xl bg-white text-black rounded-md p-4">
        <div className="flex items-start gap-4 justify-between">
          <div>
            <p className="font-semibold text-lg">New Step</p>
            <p className="text-sm text-gray-500">
              Step-ins will appear immediately to students
            </p>
          </div>
          <HiOutlinePencilAlt className="h-8 w-8 text-secondary" />
        </div>
        <div className="mt-6 flex flex-col gap-4">
          {/* Study Level & Study Program*/}
          <div className="flex space-x-4">
            <div className="flex w-full  flex-col items-start ">
              <label htmlFor="study-level" className="default-label">
                Study Level
              </label>
              <Controller
                name="study_level"
                control={control}
                render={({ field }) => (
                  <StudyLevelSelectWrapper
                    {...field}
                    onValueChange={handleStudyLevelChange}
                  >
                    {studyLevels.map((studyLevel) => (
                      <SelectItem key={studyLevel} value={studyLevel}>
                        {studyLevel}
                      </SelectItem>
                    ))}
                  </StudyLevelSelectWrapper>
                )}
              />
              {errors.study_level && (
                <p className="text-red-500 text-sm mt-1">
                  {(errors.study_level as FieldError)?.message ??
                    "An error occurred"}
                </p>
              )}
            </div>

            {/* Study Programme */}
            <div className="flex w-full flex-col items-start ">
              <label htmlFor="study-level" className="default-label">
                Study Program
              </label>
              <Controller
                name="study_programme"
                control={control}
                render={({ field }) => (
                  <StudyProgramSelectWrapper
                    {...field}
                    onValueChange={handleStudyProgrammeChange}
                  >
                    {studyProgrammes.map((programme) => (
                      <SelectItem key={programme} value={programme}>
                        {programme}
                      </SelectItem>
                    ))}
                  </StudyProgramSelectWrapper>
                )}
              />
              {errors.study_programme && (
                <p className="text-red-500 text-sm mt-1">
                  {(errors.study_programme as FieldError)?.message ??
                    "An error occurred"}
                </p>
              )}
            </div>
          </div>

          <div>
            <label htmlFor="title" className="default-label">
              Title
            </label>

            <input
              type="text"
              id="title"
              placeholder="e.g Exam preparation"
              className="block  w-full new-step-input"
              {...register("title", { required: "Title is required" })}
            />
            {errors.title && (
              <p className="text-red-500 text-sm mt-1">
                {(errors.title as FieldError)?.message ?? "An error occurred"}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="description" className="default-label">
              Description
            </label>
            <textarea
              id="description"
              className="w-full new-step-input  resize-none"
              placeholder="Enter description here... Keep it short"
              {...register("description", {
                required: "Description is required",
              })}
            />
            {errors.description && (
              <p className="text-red-500 text-sm mt-1">
                {(errors.description as FieldError)?.message ??
                  "An error occurred"}
              </p>
            )}
          </div>

          <div className="flex flex-col items-start ">
            <label htmlFor="form" className="default-label">
              Step form
            </label>
            <Controller
              name="form"
              control={control}
              rules={{ required: "Form is required" }}
              render={({ field }) => (
                <SelectWrapper {...field} onValueChange={handleStepFormChange}>
                  {forms.map((form) => {
                    return (
                      <SelectItem key={form.id} value={form.id}>
                        {form.title}
                      </SelectItem>
                    );
                  })}
                </SelectWrapper>
              )}
            />
            {errors.form && (
              <p className="text-red-500 text-sm mt-1">
                {(errors.form as FieldError)?.message ?? "An error occurred"}
              </p>
            )}
          </div>

          <div className="flex flex-col items-start justify-start space-y-2">
            <label htmlFor="image" className="default-label">
              Picture
            </label>
            <Controller
              name="image"
              control={control}
              rules={{ required: "Step image is required" }}
              render={({ field: { onChange, ref } }) => (
                <input
                  id="image"
                  type="file"
                  accept="image/*"
                  ref={ref}
                  className="w-full text-center cursor-pointer new-step-input file:rounded-full file:px-4 file:p-1 file:cursor-pointer file:text-sm file:bg-gray-300 file:text-gray-700 file:shadow-none file:border-none"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setStepImage(URL.createObjectURL(file));
                      onChange(file);
                    }
                  }}
                />
              )}
            />

            {errors.image && (
              <p className="text-red-500 text-sm mt-1">
                {(errors.image as FieldError)?.message ?? "An error occurred"}
              </p>
            )}
            {stepImage && (
              <img
                src={stepImage}
                alt="Step image"
                className="object-contain  h-[200px]"
              />
            )}
          </div>
        </div>
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={createStepLoading}
            className={`button   mt-6 text-white flex items-center justify-center space-x-2`}
          >
            {createStepLoading && (
              <CircularLoadingSpinner
                className="flex items-center justify-center"
                color="white"
              />
            )}
            <p>Publish</p>
          </button>
        </div>
      </div>
    </form>
  );
};

export default NewStepIn;
