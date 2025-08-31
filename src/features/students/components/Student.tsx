import {
  ChevronLeft,
  GraduationCap,
  IdCard,
  LibraryBig,
  Phone,
  Route,
  TrendingUp,
  Award,
  BookOpen,
  Mail,
  Plus,
  Footprints,
  MessageCircle,
  Notebook,
} from "lucide-react";

import { useLocation, useNavigate } from "react-router-dom";
import RoundedIconButton from "@/components/RoundedIconButton";
import { forwardRef, useEffect, useState } from "react";
import studentsService from "@/app/services/studentsService";
import { AxolaStudentInfo } from "@/app/models/AxolaStudent";
import CircularLoadingSpinner from "@/components/CircularLoadingSpinner";
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
import { MdEmail } from "react-icons/md";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { AlertDialogTrigger } from "@radix-ui/react-alert-dialog";
import { EngagementTrends } from "./EngagementTrends";
import { AcademicResults } from "./AcademicResults";

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
  const location = useLocation();

  if (!location.state) return null; // ensure React returns something

  const student = location.state;
  const studentFullName = `${student.name} ${student.surname}`;
  const studentFirstName =
    String(student.name || "").split(" ")[0] || student.name;

  const { user } = useAuth();
  const { createNoteLoading, createNote } = useStudents();

  const [tabValue, setTabValue] = useState<
    "step-ins" | "chats" | "notes" | "engagement-trends" | "academic-results"
  >("step-ins");
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

  const fetchStudentInfo = async () => {
    setIsLoadingStudentInfo(true);
    const info = await studentsService.fetchStudentInfo({
      student: student.id,
    });
    setStudentInfo(info);
    setIsLoadingStudentInfo(false);
  };

  const createNoteDialogActionClick = (open: boolean) => {
    setOpenCreateNoteDialog(open);
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
      setTabValue("notes");

      reset({
        title: "",
        content: "",
        category: "",
        student: "",
        administrator: "",
      });
      createNoteDialogActionClick(false);
    } catch (e) {
      // optionally toast error
    }
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
        {/* Header */}
        <div className="flex flex-col space-y-8 w-full">
          <div className="flex w-full items-center justify-start space-x-2 sticky top-0 left-0 z-20">
            <RoundedIconButton icon={BackIcon} onClick={onBackButtonClick} />
            <p className="select-none text-2xl font-semibold text-black">
              Student Profile
            </p>
          </div>

          {/* Student summary card */}
          <div className="w-full bg-white bg-opacity-35 rounded-md p-4 text-black border-secondary border-dashed border-2">
            <div className="flex items-center space-x-6">
              <div className="flex w-full flex-wrap gap-x-16 gap-y-8">
                <div className="flex space-x-3 items-center">
                  <div className="h-14 w-14 shrink-0 rounded-full bg-secondary text-white font-medium text-xl flex items-center justify-center overflow-hidden">
                    {student.profilePicture ? (
                      <img
                        className="h-14 w-14 rounded-full object-cover"
                        src={student.profilePicture}
                        alt={`${studentFullName} profile`}
                      />
                    ) : (
                      student.name.charAt(0) + student.surname.charAt(0)
                    )}
                  </div>
                  <div className="space-y-[1px]">
                    <p className="font-semibold text-slate-500">Full names</p>
                    <p className="text-gray-500">{studentFullName}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="bg-orange-500/10 text-orange-500 rounded-full p-2">
                    <GraduationCap className="h-12 w-12" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-500">Institution</p>
                    <p className="text-gray-500">{student.university}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="bg-orange-500/10 text-orange-500 rounded-full p-2">
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
                  <div className="bg-orange-500/10 text-orange-500 rounded-full p-2">
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
                  <div className="bg-secondary/10 text-secondary rounded-full p-2">
                    <Route className="h-12 w-12" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-500">Study level</p>
                    <p className="text-gray-500">{student.levelOfStudy}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="bg-secondary/10 text-secondary rounded-full p-2">
                    <MdEmail className="h-12 w-12" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-500">Email</p>
                    <p className="text-gray-500">{student.email}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="bg-secondary/10 text-secondary rounded-full p-2">
                    <Phone className="h-12 w-12" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-500">Phone Number</p>
                    <p className="text-gray-500">{student.cellphoneNumber}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Body */}
        {isLoadingStudentInfo ? (
          <div className="w-full items-center h-screen">
            <CircularLoadingSpinner
              className="flex items-center justify-center h-full"
              color="#009CA6"
              size={45}
            />
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto w-full pr-1">
            {/* Tabs header with optional "New Note" button */}
            <div className="mb-2 flex items-center justify-between gap-2">
              <Tabs
                value={tabValue}
                onValueChange={(v) => setTabValue(v as typeof tabValue)}
                defaultValue="step-ins"
                className="w-full"
              >
                <div className="flex items-center justify-between gap-3">
                  <TabsList className="grid w-full grid-cols-5 rounded-3xl">
                    <TabsTrigger
                      className="rounded-3xl font-medium"
                      value="step-ins"
                    >
                      <Footprints className="w-4 h-4 mr-2" />
                      Step-Ins
                    </TabsTrigger>
                    <TabsTrigger
                      className="rounded-3xl font-medium"
                      value="chats"
                    >
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Chats
                    </TabsTrigger>
                    <TabsTrigger
                      className="rounded-3xl font-medium"
                      value="notes"
                    >
                      <Notebook className="w-4 h-4 mr-2" />
                      Notes
                    </TabsTrigger>
                    <TabsTrigger
                      className="rounded-3xl font-medium"
                      value="engagement-trends"
                    >
                      <TrendingUp className="w-4 h-4 mr-2" />
                      Engagement Trends
                    </TabsTrigger>
                    <TabsTrigger
                      className="rounded-3xl font-medium"
                      value="academic-results"
                    >
                      <Award className="w-4 h-4 mr-2" />
                      Academic Results
                    </TabsTrigger>
                  </TabsList>

                  {/* New Note button appears only on Notes tab */}
                  <div className={tabValue === "notes" ? "block" : "hidden"}>
                    <AlertDialogTrigger>
                      <Button
                        onClick={() => createNoteDialogActionClick(true)}
                        className="bg-secondary hover:bg-secondary/90 text-white"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        New Note
                      </Button>
                    </AlertDialogTrigger>
                  </div>
                </div>

                {/* Step-Ins */}
                <TabsContent value="step-ins" className="mt-6">
                  {studentInfo.steps.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                      <div className="w-32 h-32 bg-gray-500 bg-opacity-15 rounded-full flex items-center justify-center mb-4">
                        <BookOpen className="w-16 h-16 text-gray-600" />
                      </div>
                      <p className="text-gray-600">
                        <span className="text-secondary font-semibold">
                          {studentFirstName}
                        </span>{" "}
                        has not submitted any steps yet.
                      </p>
                    </div>
                  ) : (
                    <div className="flex flex-col space-y-4">
                      {studentInfo.steps.map((stepResponse) => (
                        <StudentStepResponseCard
                          key={stepResponse.id}
                          stepResponse={stepResponse}
                        />
                      ))}
                    </div>
                  )}
                </TabsContent>

                {/* Chats */}
                <TabsContent value="chats" className="mt-6">
                  {studentInfo.chats.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                      <div className="w-32 h-32 bg-gray-500 bg-opacity-15 rounded-full flex items-center justify-center mb-4">
                        <Mail className="w-16 h-16 text-gray-600" />
                      </div>
                      <p className="text-gray-600">No chat messages yet.</p>
                    </div>
                  ) : (
                    <div className="flex flex-col">
                      {studentInfo.chats.map((chat) => (
                        <StudentChatCard key={chat.id} chat={chat} />
                      ))}
                    </div>
                  )}
                </TabsContent>

                {/* Notes */}
                <TabsContent value="notes" className="mt-6">
                  {studentInfo.notes.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                      <div className="w-32 h-32 bg-gray-500 bg-opacity-15 rounded-full flex items-center justify-center mb-4">
                        <BookOpen className="w-16 h-16 text-gray-600" />
                      </div>
                      <p className="text-gray-600">
                        <span className="text-secondary font-semibold">
                          {studentFirstName}
                        </span>
                        ’s profile doesn’t have notes yet.
                      </p>
                    </div>
                  ) : (
                    <div className="flex flex-col">
                      {studentInfo.notes.map((note) => (
                        <StudentNoteCard
                          key={note.id}
                          note={note}
                          onNoteUpdate={async () => {
                            await fetchStudentInfo();
                            setTabValue("notes");
                          }}
                        />
                      ))}
                    </div>
                  )}
                </TabsContent>

                {/* Engagement Trends (placeholder – replace with your component) */}
                <TabsContent value="engagement-trends" className="mt-6">
                  <EngagementTrends studentName={studentFullName} />
                  {/* <div className="flex flex-col items-center justify-center py-16 text-center">
                    <div className="w-32 h-32 bg-gray-500 bg-opacity-15 rounded-full flex items-center justify-center mb-4">
                      <TrendingUp className="w-16 h-16 text-gray-600" />
                    </div>
                    <p className="text-gray-600">
                      <span className="text-secondary font-semibold">
                        {studentFirstName}
                      </span>
                      ’s profile doesn’t have engagement trends yet.
                    </p>
                  </div> */}
                </TabsContent>

                {/* Academic Results (placeholder – replace with your component) */}
                <TabsContent value="academic-results" className="mt-6">
                  <AcademicResults  />
                  {/* <div className="flex flex-col items-center justify-center py-16 text-center">
                    <div className="w-32 h-32 bg-gray-500 bg-opacity-15 rounded-full flex items-center justify-center mb-4">
                      <Award className="w-16 h-16 text-gray-600" />
                    </div>
                    <p className="text-gray-600">
                      <span className="text-secondary font-semibold">
                        {studentFirstName}
                      </span>
                      ’s profile doesn’t have academic records yet.
                    </p>
                  </div> */}
                </TabsContent>
              </Tabs>
            </div>
          </div>
        )}
      </div>

      {/* New Note Dialog */}
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

            {/* Category */}
            <div className="flex flex-col items-start">
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
                    onValueChange={(v: string) => {
                      field.onChange(v);
                      handleNoteCategoryChange(v);
                    }}
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
              disabled={createNoteLoading}
              className="min-w-[100px] bg-secondary hover:bg-secondary/85 text-white"
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
