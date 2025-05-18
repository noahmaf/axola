import { AxolaStudent } from "@/app/models/AxolaStudent";
import { Send } from "lucide-react";
import { useNavigate } from "react-router-dom";

const StudentCard = ({ student }: { student: AxolaStudent }) => {
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
      className="select-none flex justify-between  items-center text-black h-[110px] shrink-0 bg-white w-full p-4 rounded-md shadow-sm  cursor-pointer transition-transform duration-300 ease-in-out hover:scale-[1.001] space-x-6"
    >
      <div className="flex space-x-6 items-center hover:bg-slate-50 hover:bg-opacity-40 w-full">
        <div className="h-20 w-20 shrink-0 rounded-full bg-secondary text-white text-2xl font-medium flex items-center justify-center">
          {student.profilePicture ? (
            <img
              className="h-20 w-20 rounded-full items-center justify-center"
              src={student.profilePicture}
            />
          ) : (
            student.name.charAt(0) + student.surname.charAt(0)
          )}
        </div>

        <div className="flex flex-col text-gray-700 space-y-2">
          <div className="font-semibold">{`${student.name} ${student.surname}`}</div>
          <div className=" flex flex-col">
            <div className="font-semibold text-secondary">{`${student.studentNumber}`}</div>
            <div className="font-medium text-orange-500">{`${student.studyProgramme}`}</div>
          </div>
        </div>
      </div>

      <div
        className="flex flex-col items-center "
        onClick={sendMessageToStudent}
      >
        <div className="h-14 w-14  rounded-full  text-slate-500 text-opacity-65 flex items-center hover:bg-gray-100 justify-center">
          <Send className=" h-11 w-11 cursor-pointer  p-2 pointer-events-auto" />
        </div>

        <p className="text-slate-500 font-semibold">Engage</p>
      </div>
    </div>
  );
};

export default StudentCard;
