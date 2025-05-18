import {
  ChevronLeft,
  GraduationCap,
  IdCard,
  LibraryBig,
  Route,
} from "lucide-react";

import { useLocation, useNavigate } from "react-router-dom";
import RoundedIconButton from "@/components/RoundedIconButton";
import TabView from "@/components/TabView";
import { forwardRef, useEffect, useState } from "react";
import studentsService from "@/app/services/studentsService";
import { AxolaStudentInfo } from "@/app/models/AxolaStudent";
import CircularLoadingSpinner from "@/components/CircularLoadingSpinner";
import EmptyResponses from "@/assets/images/empty-step-responses.png";
import StudentChatCard from "./StudentChatCard";
import StudentStepResponseCard from "./StudentStepResponseCard";
import StudentNoteCard from "./StudentNoteCard";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Controller, FieldError, useForm } from "react-hook-form";
import { CreateNoteRequest } from "@/app/models/Announcement";
import { useStudents } from "../context/studentsContext";
import { useAuth } from "@/app/context/authContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supportCategories } from "@/app/types/AnnouncementType";

const BackIcon = ChevronLeft as React.ComponentType<
  React.SVGProps<SVGSVGElement>
>;

const SelectWrapper = forwardRef<HTMLButtonElement, any>((props, ref) => (
  <Select {...props}>
    <SelectTrigger id="category" ref={ref} className="w-full select-input">
      <SelectValue placeholder="Select note category" />
    </SelectTrigger>
    <SelectContent>{props.children}</SelectContent>
  </Select>
));

const Student = () => {
  const navigate = useNavigate();

  const { user } = useAuth();
  const { createNoteLoading, createNote } = useStudents();

  const [tabIndex, setTabIndex] = useState(0);
  const [isLoadingStudentInfo, setIsLoadingStudentInfo] = useState(false);
  const [openCreateNoteDialog, setOpenCreateNoteDialog] = useState(false);

  const [studentInfo, setStudentInfo] = useState<AxolaStudentInfo>({
    chats: [],
    steps: [],
    notes: [],
  });

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    control,
    formState: { errors },
  } = useForm<CreateNoteRequest>();

  const location = useLocation();

  if (!location.state) return;

  const student = location.state;

  const fetchStudentInfo = async () => {
    setIsLoadingStudentInfo(true);
    const info = await studentsService.fetchStudentInfo({
      student: student.id,
    });
    setStudentInfo(info);
    setIsLoadingStudentInfo(false);
  };

  const createNoteDialogActionClick = (updateOpenCreateNoteDialog: boolean) => {
    setOpenCreateNoteDialog(updateOpenCreateNoteDialog);
  };

  const handleNoteCategoryChange = (selectedOption: string) => {
    setValue("category", selectedOption);
  };

  const confirmCreateNote = async (data: CreateNoteRequest) => {
    if (createNoteLoading) return;
    try {
      await createNote({
        title: data.title,
        content: data.content,
        category: data.category,
        student: student.id,
        administrator: user?.id ?? "",
      });
      await fetchStudentInfo();
      setTabIndex(2);

      reset({
        title: "",
        content: "",
        category: "",
        student: "",
        administrator: "",
      });
      createNoteDialogActionClick(false);
    } catch (e) {}
  };

  const cancelCreateNote = () => {
    reset({
      title: "",
      content: "",
      category: "",
      student: "",
      administrator: "",
    });
    createNoteDialogActionClick(false);
  };

  useEffect(() => {
    fetchStudentInfo();
  }, []);

  const onBackButtonClick = () => {
    navigate(-1);
  };

  return (
    <AlertDialog>
      <div className="bg-white w-full flex flex-col p-4 items-start h-screen overflow-hidden space-y-4">
        <div className="flex flex-col space-y-8 w-full">
          <div className="flex w-full items-center justify-start space-x-2 sticky top-0 left-0 z-20">
            <RoundedIconButton icon={BackIcon} onClick={onBackButtonClick} />
            <p className="select-none text-2xl font-semibold text-black">
              Student Profile
            </p>
          </div>

          <div className="w-full bg-white bg-opacity-35 rounded-md p-4 text-black border-secondary border-dashed border-2">
            <div className="flex items-center space-x-6">
              <div className="flex justify-between w-full">
                <div className="flex space-x-3 items-center">
                  <div className="h-14 w-14 shrink-0 rounded-full bg-secondary text-white font-medium text-xl flex items-center justify-center">
                    {student.profilePicture ? (
                      <img
                        className="h-14 w-14 rounded-full items-center justify-center"
                        src={student.profilePicture}
                      />
                    ) : (
                      student.name.charAt(0) + student.surname.charAt(0)
                    )}
                  </div>
                  <div className="space-y-[1px]">
                    <p className="font-semibold text-slate-500">Full names</p>
                    <p className="text-gray-500">{`${student.name} ${student.surname}`}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="bg-orange-500 bg-opacity-10 text-orange-500 rounded-full p-2">
                    <GraduationCap className="h-12 w-12" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-500">Institution</p>
                    <p className="text-gray-500">{student.university}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="bg-orange-500 bg-opacity-10 text-orange-500 rounded-full p-2">
                    <IdCard className="h-12 w-12" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-500">
                      Student number
                    </p>
                    <p className="text-gray-500">{student.studentNumber}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="bg-orange-500 bg-opacity-10 text-orange-500 rounded-full p-2">
                    <LibraryBig className="h-12 w-12" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-500">
                      Study Program
                    </p>
                    <p className="text-gray-500">{student.studyProgramme}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="bg-secondary bg-opacity-10 text-secondary rounded-full p-2">
                    <Route className="h-12 w-12" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-500">Study level</p>
                    <p className="text-gray-500">{student.levelOfStudy}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {isLoadingStudentInfo && (
          <div className="w-full items-center h-screen">
            <CircularLoadingSpinner
              className="flex items-center justify-center h-full"
              color="#009CA6"
              size={45}
            />
          </div>
        )}

        {!isLoadingStudentInfo && (
          <div className="flex-1 overflow-y-auto w-full pr-1">
            <div>
              <TabView
                tabIndex={tabIndex}
                onNewNoteOpen={() => {
                  createNoteDialogActionClick(true);
                }}
                tabs={[
                  {
                    title: "Step-Ins",
                    content: () => (
                      <div>
                        {studentInfo.steps.length === 0 && (
                          <div className="flex flex-col items-center justify-center text-center space-y-12 p-24">
                            <img className="h-32" src={EmptyResponses} />
                            <p className="text-lg font-medium text-neutral-500">
                              <span>
                                <span className="font-bold text-secondary">
                                  {student.name}
                                </span>{" "}
                                has not submitted any steps yet.
                              </span>
                            </p>
                          </div>
                        )}

                        {studentInfo.steps.length !== 0 && (
                          <div className="flex flex-col space-y-4">
                            {studentInfo.steps.map((stepResponse) => (
                              <StudentStepResponseCard
                                key={stepResponse.id}
                                stepResponse={stepResponse}
                              />
                            ))}
                          </div>
                        )}
                      </div>
                    ),
                  },
                  {
                    title: "Chats",
                    content: () => (
                      <div className="flex flex-col">
                        {studentInfo.chats.length === 0 && (
                          <div className="flex flex-col items-center justify-center text-center space-y-12 p-24">
                            <img className="h-32" src={EmptyResponses} />
                            <p className="text-lg font-medium text-neutral-500">
                              <span>
                                <span className="font-bold text-secondary">
                                  {student.name}
                                </span>{" "}
                                has not opened any chats yet.
                              </span>
                            </p>
                          </div>
                        )}

                        {studentInfo.chats.length !== 0 &&
                          studentInfo.chats.map((chat) => (
                            <StudentChatCard key={chat.id} chat={chat} />
                          ))}
                      </div>
                    ),
                  },
                  {
                    title: "Notes",

                    content: () => (
                      <div className="flex flex-col">
                        {studentInfo.notes.length === 0 && (
                          <div className="flex flex-col items-center justify-center text-center space-y-12 p-24">
                            <img className="h-32" src={EmptyResponses} />
                            <p className="text-lg font-medium text-neutral-500">
                              <span>
                                <span className="font-bold text-secondary">
                                  {student.name}'s{" "}
                                </span>
                                profile doesn't have notes yet.
                              </span>
                            </p>
                          </div>
                        )}

                        {studentInfo.notes.length !== 0 &&
                          studentInfo.notes.map((note) => (
                            <StudentNoteCard
                              key={note.id}
                              note={note}
                              onNoteUpdate={async () => {
                                await fetchStudentInfo();
                                setTabIndex(2);
                              }}
                            />
                          ))}
                      </div>
                    ),
                  },
                ]}
              />
            </div>
          </div>
        )}
      </div>
      {openCreateNoteDialog && (
        <AlertDialogContent className="text-black">
          <AlertDialogTitle>New Note</AlertDialogTitle>
          <AlertDialogDescription className="space-y-4">
            All notes and note changes will not be sent to the students.
          </AlertDialogDescription>
          <form
            onSubmit={handleSubmit(confirmCreateNote)}
            className="mt-6 flex flex-col gap-4 w-full"
          >
            {/* Title */}
            <div className="flex flex-col items-start">
              <label htmlFor="title" className="default-label">
                Note Title
              </label>
              <input
                type="text"
                id="title"
                placeholder="e.g Note name"
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
                Assistance category
              </label>
              <Controller
                name="category"
                control={control}
                rules={{ required: "Note category is required" }}
                render={({ field }) => (
                  <SelectWrapper
                    {...field}
                    onValueChange={handleNoteCategoryChange}
                  >
                    {supportCategories.map((noteCategory) => (
                      <SelectItem
                        key={noteCategory.value}
                        value={noteCategory.value}
                      >
                        {noteCategory.label}
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
                Assistance Description
              </label>
              <textarea
                id="description"
                className="w-full new-announcement-input resize-none"
                placeholder="Enter description here... Keep it short"
                {...register("content", {
                  required: "Assistance description is required",
                })}
              />
              {errors.content && (
                <p className="text-red-500 text-sm mt-1">
                  {(errors.content as FieldError)?.message ??
                    "An error occurred"}
                </p>
              )}
            </div>
          </form>
          <AlertDialogFooter>
            <AlertDialogCancel
              className="min-w-[100px]"
              onClick={cancelCreateNote}
            >
              Close
            </AlertDialogCancel>
            <AlertDialogAction
              type="submit"
              onClick={handleSubmit(confirmCreateNote)}
              form="edit-announcement-form"
              disabled={createNoteLoading}
              className="min-w-[100px] bg-secondary hover:bg-secondary hover:bg-opacity-85 text-white"
            >
              {createNoteLoading ? (
                <CircularLoadingSpinner
                  className="flex items-center w-full justify-center"
                  color="white"
                />
              ) : (
                "Create"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      )}
    </AlertDialog>
  );
};

export default Student;
