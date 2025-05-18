import { UpdateNoteSchema } from "@/app/models/Announcement";
import { SupportNote } from "@/app/models/SupportChat";
import { formatChatTimestamp } from "@/app/utils/chatDateFormat";
import CircularLoadingSpinner from "@/components/CircularLoadingSpinner";
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
import { Notebook } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useStudents } from "../context/studentsContext";

const StudentNoteCard = ({
  note,
  onNoteUpdate,
}: {
  note: SupportNote;
  onNoteUpdate: () => {};
}) => {
  const [editNoteDialog, setEditNote] = useState<boolean>(false);

  const { updateNote, updateNoteLoading } = useStudents();

  // React Hook Form setup
  const { register, handleSubmit, setValue, reset } =
    useForm<UpdateNoteSchema>();

  const editNoteDialogActionClick = (updateEditNote: boolean) => {
    if (updateEditNote) {
      setValue("content", note.content);
      setValue("title", note.title);
    }

    setEditNote(updateEditNote);
  };

  const cancelNoteEdit = () => {
    reset({
      title: "",
      content: "",
    });
    editNoteDialogActionClick(false);
  };

  const confirmUpdate = async (data: UpdateNoteSchema) => {
    if (updateNoteLoading) return;
    await updateNote({
      originalNote: note,
      updatedNote: data,
    });
    onNoteUpdate();
    editNoteDialogActionClick(false);
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <div
          onClick={() => editNoteDialogActionClick(true)}
          className="bg-white shadow-sm py-4 pl-8 pr-4 cursor-pointer hover:bg-secondary hover:bg-opacity-5  flex h-fit items-center  select-none"
        >
          <div className="h-14 w-14 shrink-0 rounded-full bg-secondary flex items-center justify-center">
            <Notebook />
          </div>

          <div className="ml-4 flex flex-col items-start justify-center w-full ">
            <p className="font-semibold text-black">{`${note.title}`}</p>
            <p className="text-gray-500 text-base font-medium">
              {note.content}
            </p>
          </div>

          <div className="flex flex-col justify-center space-y-4 items-end w-full">
            <p className="text-gray-500 text-base font-medium">
              {formatChatTimestamp(note.updatedAt)}
            </p>
            <div
              className={`${
                note.category === "Accommodation"
                  ? "bg-orange-500"
                  : note.category === "Academic"
                  ? "bg-blue-500"
                  : note.category === "Financial"
                  ? "bg-green-500"
                  : note.category === "Learning Resources"
                  ? "bg-pink-500"
                  : note.category === "Registration"
                  ? "bg-yellow-500"
                  : note.category === "General"
                  ? "bg-purple-500"
                  : ""
              } bg-opacity-10 px-4 flex w-fit shrink-0 py-1 rounded-full justify-center items-center text-center`}
            >
              <p
                className={`${
                  note.category === "Accommodation"
                    ? "text-orange-500"
                    : note.category === "Academic"
                    ? "text-blue-500"
                    : note.category === "Financial"
                    ? "text-green-500"
                    : note.category === "Learning Resources"
                    ? "text-pink-500"
                    : note.category === "Registration"
                    ? "text-yellow-500"
                    : note.category === "General"
                    ? "text-purple-500"
                    : ""
                } text-sm font-semibold`}
              >
                {note.category}
              </p>
            </div>
          </div>
        </div>
      </AlertDialogTrigger>

      {editNoteDialog && (
        <form id="edit-note-form" onSubmit={handleSubmit(confirmUpdate)}>
          <AlertDialogContent className="text-black">
            <AlertDialogHeader>
              <AlertDialogTitle>Assistance Note</AlertDialogTitle>
              <AlertDialogDescription className="space-y-4">
                All changes will not be saved until you submit. Once submitted
                the changes will be saved to the note.
              </AlertDialogDescription>
            </AlertDialogHeader>

            <div className="flex flex-col items-start">
              <label htmlFor="title" className="default-label">
                Title
              </label>
              <input
                type="text"
                id="title"
                className="block w-full new-announcement-input"
                {...register("title")}
              />
            </div>

            <div className="flex flex-col items-start">
              <label htmlFor="description" className="default-label">
                Assistance description
              </label>
              <textarea
                id="description"
                rows={5}
                className="w-full new-announcement-input "
                {...register("content")}
              />
            </div>
            <AlertDialogFooter>
              <AlertDialogCancel
                className="min-w-[100px]"
                onClick={cancelNoteEdit}
              >
                Close
              </AlertDialogCancel>
              <AlertDialogAction
                type="submit"
                onClick={handleSubmit(confirmUpdate)}
                form="edit-announcement-form"
                className="min-w-[100px] bg-secondary hover:bg-secondary hover:bg-opacity-85 text-white"
              >
                {updateNoteLoading ? (
                  <CircularLoadingSpinner
                    className="flex items-center w-full justify-center"
                    color="white"
                  />
                ) : (
                  "Edit"
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </form>
      )}
    </AlertDialog>
  );
};

export default StudentNoteCard;
