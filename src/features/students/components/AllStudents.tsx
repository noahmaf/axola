import { AxolaStudent } from "@/app/models/AxolaStudent";
import StudentCard from "@/features/students/components/StudentCard";
import { useStudents } from "../context/studentsContext";
import CircularLoadingSpinner from "@/components/CircularLoadingSpinner";
import { Download, Filter } from "lucide-react";
import { forwardRef, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAnnouncements } from "@/features/announcements/context/announcmentsContext";
import { Controller, useForm } from "react-hook-form";
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
import { IoAdd, IoClose } from "react-icons/io5";
import UploadStudentDialog from "@/features/students/components/UploadStudentDialog";
import { useAuth } from "@/app/context/authContext";
import EmptyResponses from "@/assets/images/empty-step-responses.png";

interface StudentsFilterSchema {
  studyLevel: string;
  studyProgramme: string;
}

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

const AllStudents = () => {
  const { handleSubmit, setValue, control } = useForm<StudentsFilterSchema>();

  const [search, setSearch] = useState("");
  const { students, isExportLoading, exportStudents, fetchStudents } =
    useStudents();
  const { studyLevels: levels, studyProgrammes: programmes } =
    useAnnouncements();
  const [showFilterDialog, setShowFilterDialog] = useState(false);
  const [studyLevelFilter, setStudyLevelFilter] = useState("All");
  const [studyProgrammeFilter, setStudyProgrammeFilter] = useState("All");
  const { user } = useAuth();

  const studyProgrammes = ["All", ...programmes];
  const studyLevels = ["All", ...levels];

  const applyFilters = (data: StudentsFilterSchema) => {
    setStudyLevelFilter(data.studyLevel);
    setStudyProgrammeFilter(data.studyProgramme);

    closeFilterDialog();
  };

  const handleChangeStudyLevelFilter = (newStudyLevel: string) => {
    setValue("studyLevel", newStudyLevel);
  };

  const handleChangeStudyProgrammeFilter = (newStudyProgramme: string) => {
    setValue("studyProgramme", newStudyProgramme);
  };

  const openFilterDialog = () => {
    if (studyLevelFilter) {
      setValue("studyLevel", studyLevelFilter);
    } else {
      setValue("studyLevel", studyLevels[0]);
    }

    if (studyProgrammeFilter) {
      setValue("studyProgramme", studyProgrammeFilter);
    } else {
      setValue("studyProgramme", studyProgrammes[0]);
    }

    setShowFilterDialog(true);
  };

  const closeFilterDialog = () => {
    setShowFilterDialog(false);
  };

  const [open, setOpen] = useState(false);

  return (
    <AlertDialog>
      <div className="flex-1 overflow-y-auto  space-y-2">
        <div className=" flex justify-between items-center p-6 min-h-[80px] w-full bg-white sticky top-0 left-0 ">
          <div className="flex  flex-col space-y-4 w-full">
            <div className="flex flex-col items-startjustify-between  w-full space-y-4">
              <p className="text-2xl font-semibold text-black">Students</p>
              <div className="flex justify-between">
                <input
                  type="search"
                  placeholder="Search..."
                  className="w-[364px]  input"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    const value = e.target.value.toLowerCase();
                    setSearch(value);
                  }}
                />
                <div className=" flex space-x-2 ">
                  <AlertDialogTrigger asChild>
                    <button
                      className="outlined-button "
                      onClick={openFilterDialog}
                    >
                      <p>Filter </p>
                      <Filter className="h-6 w-6" />
                    </button>
                  </AlertDialogTrigger>

                  {user?.owner && (
                    <>
                      <button onClick={() => setOpen(true)} className="button">
                        <p>Add Students</p>
                        <IoAdd className="h-6 w-6" />
                      </button>

                      {open && (
                        <UploadStudentDialog
                          open={open}
                          onClose={async () => {
                            await fetchStudents();
                            setOpen(false);
                          }}
                        />
                      )}
                    </>
                  )}

                  <button className="button " onClick={exportStudents}>
                    {isExportLoading}
                    <p>Export </p>

                    {isExportLoading && (
                      <CircularLoadingSpinner
                        className="flex items-center justify-center"
                        color="white"
                      />
                    )}

                    {!isExportLoading && <Download className="h-6 w-6" />}
                  </button>
                </div>
              </div>
            </div>
            {(studyProgrammeFilter !== "All" || studyLevelFilter !== "All") && (
              <div className="flex flex-col space-y-2 justify-start">
                <p className="text-lg text-secondary font-semibold">Filters</p>
                <div className="flex items-center space-x-4 select-none">
                  {studyProgrammeFilter !== "All" && (
                    <div
                      onClick={() => {
                        handleChangeStudyProgrammeFilter("All");
                        setStudyProgrammeFilter("All");
                      }}
                      className="cursor-pointer  space-x-2 bg-primary w-fit text-primary bg-opacity-10 px-8 py-2 rounded-full flex items-center justify-center"
                    >
                      <p>{studyProgrammeFilter}</p>
                      <IoClose className="h-6 w-6" />
                    </div>
                  )}

                  {studyLevelFilter !== "All" && (
                    <div
                      onClick={() => {
                        handleChangeStudyLevelFilter("All");
                        setStudyLevelFilter("All");
                      }}
                      className="cursor-pointer  space-x-2 bg-secondary w-fit text-secondary bg-opacity-10 px-8 py-2 rounded-full flex items-center justify-center"
                    >
                      <p> {`Study level ${studyLevelFilter}`}</p>
                      <IoClose className="h-6 w-6" />
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="p-1 pr-0 pt-0 space-y-1">
          {students
            .filter((student) => {
              if (studyLevelFilter === "All") {
                if (studyProgrammeFilter !== "All") {
                  return student.studyProgramme === studyProgrammeFilter;
                }
                return true;
              } else {
                if (studyProgrammeFilter !== "All") {
                  return (
                    student.levelOfStudy === studyLevelFilter &&
                    student.studyProgramme === studyProgrammeFilter
                  );
                } else {
                  return student.levelOfStudy === studyLevelFilter;
                }
              }
            })
            .filter((student) => {
              const fullName =
                `${student.name} ${student.surname}`.toLowerCase();
              return fullName.includes(search);
            })
            .map((student: AxolaStudent) => {
              return (
                <StudentCard key={student.studentNumber} student={student} />
              );
            })}
          {students
            .filter((student) => {
              if (studyLevelFilter === "All") {
                if (studyProgrammeFilter !== "All") {
                  return student.studyProgramme === studyProgrammeFilter;
                }
                return true;
              } else {
                if (studyProgrammeFilter !== "All") {
                  return (
                    student.levelOfStudy === studyLevelFilter &&
                    student.studyProgramme === studyProgrammeFilter
                  );
                } else {
                  return student.levelOfStudy === studyLevelFilter;
                }
              }
            })
            .filter((student) => {
              const fullName =
                `${student.name} ${student.surname}`.toLowerCase();
              return fullName.includes(search);
            })
            .map((student: AxolaStudent) => {
              return (
                <StudentCard key={student.studentNumber} student={student} />
              );
            }).length == 0 && (
            <div className="flex flex-col  items-center justify-center text-center space-y-12 p-24">
              <img className="h-32 " src={EmptyResponses} />
              <p className=" text-lg font-medium  text-neutral-500">
                {search && "Results not found."}
                {!search && "Your project doesn't have any students yet."}
              </p>
            </div>
          )}
        </div>
      </div>

      {showFilterDialog && (
        <form id="students-filter-form" onSubmit={handleSubmit(applyFilters)}>
          <AlertDialogContent className="text-black">
            <AlertDialogHeader>
              <AlertDialogTitle>Filter Students</AlertDialogTitle>
              <AlertDialogDescription className="space-y-4">
                All selected filters will not be applied, unless submitted.
              </AlertDialogDescription>
            </AlertDialogHeader>

            {/* Study Level & Study Program*/}
            <div className="flex flex-col space-y-4">
              <div className="flex w-full  flex-col items-start ">
                <label htmlFor="study-level" className="default-label">
                  Study Level
                </label>
                <Controller
                  name="studyLevel"
                  control={control}
                  render={({ field }) => (
                    <StudyLevelSelectWrapper
                      {...field}
                      onValueChange={handleChangeStudyLevelFilter}
                    >
                      {studyLevels.map((studyLevel) => (
                        <SelectItem key={studyLevel} value={studyLevel}>
                          {studyLevel}
                        </SelectItem>
                      ))}
                    </StudyLevelSelectWrapper>
                  )}
                />
              </div>

              {/* Study Programme */}
              <div className="flex w-full flex-col items-start ">
                <label htmlFor="study-level" className="default-label">
                  Study Program
                </label>
                <Controller
                  name="studyProgramme"
                  control={control}
                  render={({ field }) => (
                    <StudyProgramSelectWrapper
                      {...field}
                      onValueChange={handleChangeStudyProgrammeFilter}
                    >
                      {studyProgrammes.map((programme) => (
                        <SelectItem key={programme} value={programme}>
                          {programme}
                        </SelectItem>
                      ))}
                    </StudyProgramSelectWrapper>
                  )}
                />
              </div>
            </div>
            <AlertDialogFooter>
              <AlertDialogCancel
                className="min-w-[100px]"
                onClick={closeFilterDialog}
              >
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                type="submit"
                onClick={handleSubmit(applyFilters)}
                form="edit-announcement-form"
                className="min-w-[100px] bg-secondary hover:bg-secondary hover:bg-opacity-85 text-white"
              >
                Apply Filters
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </form>
      )}
    </AlertDialog>
  );
};

export default AllStudents;
