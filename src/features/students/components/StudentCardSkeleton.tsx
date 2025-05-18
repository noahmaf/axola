import { AxolaStudent } from "@/app/models/AxolaStudent";
import { Send } from "lucide-react";
import { useNavigate } from "react-router-dom";

const StudentCardSkeleton = ({ student }: { student: AxolaStudent }) => {
  const navigate = useNavigate();

  const viewStudentProfile = () => {
    navigate(`/students/${student.name + "-" + student.surname}`, {
      state: student,
    });
  };

  const sendMessageToStudent = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div
      onClick={viewStudentProfile}
      className="select-none flex justify-between  items-center text-black h-[110px] shrink-0 bg-white w-full p-4 rounded-md shadow-sm hover:bg-opacity-40 hover:bg-slate-50 cursor-pointer transition-transform duration-300 ease-in-out hover:scale-[1.001] space-x-6"
    >
      <div className="flex space-x-6 items-center">
        <div className="h-20 w-20 shrink-0 rounded-full bg-secondary flex items-center justify-center">
          {student.profilePicture ? (
            <img
              className="h-20 w-20 rounded-full items-center justify-center"
              src={student.profilePicture}
            />
          ) : (
            student.name.charAt(0)
          )}
        </div>

        <div className="flex flex-col text-gray-700">
          <div className="font-semibold">{`${student.name} ${student.surname}`}</div>
          <div>{`${student.studyProgramme}`}</div>
          <div>{`${student.studentNumber}`}</div>
        </div>
      </div>

      <div
        className="flex flex-col items-center "
        onClick={sendMessageToStudent}
      >
        <div className="h-14 w-14  rounded-full  text-secondary flex items-center hover:bg-gray-200 justify-center">
          <Send className=" h-11 w-11 cursor-pointer  p-2 pointer-events-auto" />
        </div>

        <p className="text-gray-500">Engage</p>
      </div>
    </div>
  );
};

export default StudentCardSkeleton;
