import { FieldError, useForm, Controller } from "react-hook-form";
import { announcementTypes } from "@/app/types/AnnouncementType";
import { CreateAnnouncementRequest } from "@/app/models/Announcement";
import CircularLoadingSpinner from "@/components/CircularLoadingSpinner";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
  SelectItem,
} from "@/components/ui/select";
import { forwardRef } from "react";
import { Pencil } from "lucide-react";
import { useAnnouncements } from "@/features/announcements/context/announcmentsContext";

// Custom Select Wrapper with forwardRef
const SelectWrapper = forwardRef<HTMLButtonElement, any>((props, ref) => (
  <Select {...props}>
    <SelectTrigger id="category" ref={ref} className="w-full select-input">
      <SelectValue placeholder="Select announcement type" />
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

SelectWrapper.displayName = "SelectWrapper";

const NewAnnouncementForm = () => {
  const {
    createAnnouncement,
    createAnnouncementLoading,
    announcementsLoading,
    studyLevels,
    studyProgrammes,
  } = useAnnouncements();

  // React Hook Form setup
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    control,
    formState: { errors },
  } = useForm<CreateAnnouncementRequest>();

  const handleAnnouncementTypeChange = (selectedOption: string) => {
    setValue("category", selectedOption);
  };

  const handleStudyLevelChange = (selectedOption: string) => {
    setValue("study_level", selectedOption);
  };

  const handleStudyProgrammeChange = (selectedOption: string) => {
    setValue("study_programme", selectedOption);
  };

  const publishAnnouncement = async (data: CreateAnnouncementRequest) => {
    try {
      await createAnnouncement({
        title: data.title,
        message: data.message,
        category: data.category,
        studyLevel: data.study_level,
        studyProgramme: data.study_programme,
      });

      reset({
        title: "",
        message: "",
        category: "",
        study_level: "",
        study_programme: "",
      });
    } catch (e) {}
  };

  return announcementsLoading ? (
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
        {/* Announcement Type */}
        <div className="flex flex-col items-start space-y-1">
          <div className=" bg-secondary bg-opacity-20  rounded-md ">
            _________________
          </div>

          <div className=" bg-secondary bg-opacity-20 text-transparent p-2 w-full rounded-md">
            _
          </div>
        </div>

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
    <div className="w-full shadow-xl bg-white text-black rounded-md p-4">
      <div className="flex items-start gap-4 justify-between">
        <div className="flex flex-col items-start">
          <p className="font-semibold text-lg">New Announcement</p>
          <p className="text-sm text-gray-500">
            Announcements will appear immediately to students
          </p>
        </div>
        <Pencil className="h-6 w-6 text-secondary" />
      </div>
      <div className="flex items-start gap-4 justify-between">
        <form
          onSubmit={handleSubmit(publishAnnouncement)}
          className="mt-6 flex flex-col gap-4 w-full"
        >
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
                  {(errors.category as FieldError)?.message ??
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
                  {(errors.category as FieldError)?.message ??
                    "An error occurred"}
                </p>
              )}
            </div>
          </div>

          {/* Title */}
          <div className="flex flex-col items-start">
            <label htmlFor="title" className="default-label">
              Title
            </label>
            <input
              type="text"
              id="title"
              placeholder="e.g Exam preparation"
              className="block w-full new-announcement-input"
              {...register("title", { required: "Title is required" })}
            />
            {errors.title && (
              <p className="text-red-500 text-sm mt-1">
                {(errors.title as FieldError)?.message ?? "An error occurred"}
              </p>
            )}
          </div>

          {/* Announcement Type */}
          <div className="flex flex-col items-start ">
            <label htmlFor="category" className="default-label">
              Announcement type
            </label>
            <Controller
              name="category"
              control={control}
              rules={{ required: "Announcement type is required" }}
              render={({ field }) => (
                <SelectWrapper
                  {...field}
                  onValueChange={handleAnnouncementTypeChange}
                >
                  {announcementTypes.map((announcement) => (
                    <SelectItem
                      key={announcement.value}
                      value={announcement.value}
                    >
                      {announcement.label}
                    </SelectItem>
                  ))}
                </SelectWrapper>
              )}
            />
            {errors.category && (
              <p className="text-red-500 text-sm mt-1">
                {(errors.category as FieldError)?.message ??
                  "An error occurred"}
              </p>
            )}
          </div>

          {/* Description */}
          <div className="flex flex-col items-start">
            <label htmlFor="description" className="default-label">
              Description
            </label>
            <textarea
              id="description"
              className="w-full new-announcement-input resize-none"
              placeholder="Enter description here... Keep it short"
              {...register("message", {
                required: "Description is required",
              })}
            />
            {errors.message && (
              <p className="text-red-500 text-sm mt-1">
                {(errors.message as FieldError)?.message ?? "An error occurred"}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={createAnnouncementLoading}
              className={`button   mt-6 text-white flex items-center justify-center space-x-2`}
            >
              {createAnnouncementLoading && (
                <CircularLoadingSpinner
                  className="flex items-center justify-center"
                  color="white"
                />
              )}
              <p>Publish</p>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewAnnouncementForm;
