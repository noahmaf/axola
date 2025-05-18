import { MdEditSquare } from "react-icons/md";
import {
  Announcement,
  UpdateAnnouncementSchema,
} from "@/app/models/Announcement";
import { Trash2 } from "lucide-react";
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
import { forwardRef, useState } from "react";
import CircularLoadingSpinner from "@/components/CircularLoadingSpinner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Controller, useForm } from "react-hook-form";
import { announcementTypes } from "@/app/types/AnnouncementType";
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

SelectWrapper.displayName = "SelectWrapper";

const AnnouncementCard = ({ announcement }: { announcement: Announcement }) => {
  const [editAnnouncementDialog, setEditAnnouncement] =
    useState<boolean>(false);
  const [deleteAnnouncementDialog, setDeleteAnnouncement] =
    useState<boolean>(false);

  const {
    deleteAnnouncement,
    deleteAnnouncementLoading,
    updateAnnouncement,
    updateAnnouncementLoading,
  } = useAnnouncements();

  // React Hook Form setup
  const { register, handleSubmit, setValue, reset, control } =
    useForm<UpdateAnnouncementSchema>();

  const editAnnouncementDialogActionClick = (
    updateEditAnnouncement: boolean
  ) => {
    setDeleteAnnouncement(false);
    setValue("category", announcement.category);
    setValue("title", announcement.title);
    setValue("message", announcement.message);

    setEditAnnouncement(updateEditAnnouncement);
  };

  const deleteAnnouncementDialogActionClick = (
    updateDeleteAnnouncement: boolean
  ) => {
    setEditAnnouncement(false);
    setDeleteAnnouncement(updateDeleteAnnouncement);
  };

  const cancelAnnouncementDelete = () => {
    deleteAnnouncementDialogActionClick(false);
  };

  const cancelAnnouncementEdit = () => {
    reset({
      title: "",
      message: "",
      category: "",
    });
    editAnnouncementDialogActionClick(false);
  };

  const confirmDelete = async () => {
    if (deleteAnnouncementLoading) return;
    await deleteAnnouncement({ id: announcement.id });
  };

  const confirmUpdate = async (data: UpdateAnnouncementSchema) => {
    if (updateAnnouncementLoading) return;

    await updateAnnouncement({
      originalAnnouncement: announcement,
      updatedAnnouncement: data,
    });
  };

  const handleAnnouncementTypeChange = (selectedOption: string) => {
    setValue("category", selectedOption);
  };

  return (
    <AlertDialog>
      <div className="bg-white h-fit p-2 rounded-md shadow-lg">
        <div className="flex items-center justify-between ">
          <p className="text-base font-semibold">{announcement.title}</p>
          <div className=" flex ">
            <AlertDialogTrigger asChild>
              <button
                onClick={() => editAnnouncementDialogActionClick(true)}
                className="h-10 w-10 text-gray-500 hover:text-secondary hover:bg-secondary rounded-full hover:bg-opacity-10  flex items-center justify-center"
              >
                <MdEditSquare className="h-5 w-5" />
              </button>
            </AlertDialogTrigger>

            <AlertDialogTrigger asChild>
              <button
                onClick={() => deleteAnnouncementDialogActionClick(true)}
                className=" h-10 w-10  text-red-500 hover:bg-red-500 rounded-full hover:bg-opacity-10 flex items-center justify-center"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            </AlertDialogTrigger>
          </div>
        </div>

        <p className="text-sm text-slate-700 font-medium text-start">
          {announcement.message}
        </p>

        <p className="mt-2 text-sm text-slate-700 font-medium">
          {announcement.date}
        </p>
      </div>

      {editAnnouncementDialog && (
        <form
          id="edit-announcement-form"
          onSubmit={handleSubmit(confirmUpdate)}
        >
          <AlertDialogContent className="text-black">
            <AlertDialogHeader>
              <AlertDialogTitle>Edit announcement</AlertDialogTitle>
              <AlertDialogDescription className="space-y-4">
                All changes wiwll not be saved until you submit. Once submitted
                the changes will be sent to the students.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="flex flex-col items-start w-full">
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
            </div>

            <div className="flex flex-col items-start">
              <label htmlFor="title" className="default-label">
                Title
              </label>
              <input
                type="text"
                id="title"
                placeholder="e.g Exam preparation"
                className="block w-full new-announcement-input"
                {...register("title")}
              />
            </div>

            <div className="flex flex-col items-start">
              <label htmlFor="description" className="default-label">
                Description
              </label>
              <textarea
                id="description"
                className="w-full new-announcement-input resize-none"
                placeholder="Enter description here... Keep it short"
                {...register("message")}
              />
            </div>
            <AlertDialogFooter>
              <AlertDialogCancel
                className="min-w-[100px]"
                onClick={cancelAnnouncementEdit}
              >
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                type="submit"
                form="edit-announcement-form"
                className="min-w-[100px] bg-secondary hover:bg-secondary hover:bg-opacity-85 text-white"
              >
                {updateAnnouncementLoading ? (
                  <CircularLoadingSpinner
                    className="flex items-center w-full justify-center"
                    color="white"
                  />
                ) : (
                  "Update Announcement"
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </form>
      )}

      {deleteAnnouncementDialog && (
        <AlertDialogContent className="text-black">
          <AlertDialogHeader>
            <AlertDialogTitle>
              Confirm deletion of announcement?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete the selected announcement? This
              action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={cancelAnnouncementDelete}
              className="min-w-[100px]"
              disabled={deleteAnnouncementLoading}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              disabled={deleteAnnouncementLoading}
              onClick={confirmDelete}
              className="bg-red-500 text-white hover:bg-red-400 min-w-[100px] flex"
            >
              {deleteAnnouncementLoading && (
                <CircularLoadingSpinner
                  className="flex items-center w-full justify-center"
                  color="white"
                />
              )}
              <p>Delete Announcement</p>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      )}
    </AlertDialog>
  );
};

export default AnnouncementCard;
