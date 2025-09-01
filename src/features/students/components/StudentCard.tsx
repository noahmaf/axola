import { AxolaStudent } from "@/app/models/AxolaStudent";
import { Send } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
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
import supportChatsService from "@/app/services/supportService";
import { useAuth } from "@/app/context/authContext";

const StudentCard = ({ student }: { student: AxolaStudent }) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [engageOpen, setEngageOpen] = useState(false);
  const [message, setMessage] = useState("");

  const viewStudentProfile = () => {
    navigate(`/students/${student.name + "-" + student.surname}`, {
      state: student,
    });
  };

  const stopCardClick = (e: React.MouseEvent) => e.stopPropagation();

  const onEngageSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = message.trim();
    if (!trimmed) return; // prevent empty submissions

    await supportChatsService.sendStudentEngagement({
      student: student.id,
      message: trimmed,
      administrator: user!.id,
      adminName:user!.name+" "+user!.surname,
      
      program: user?.currentProgram?.id??""
    });

    setMessage("");
    setEngageOpen(false);
  };

  return (
    <AlertDialog
      open={engageOpen}
      onOpenChange={(open) => {
        setEngageOpen(open);
        if (!open) setMessage("");
      }}
    >
      <div
        onClick={viewStudentProfile}
        className="select-none flex justify-between items-center text-black h-[110px] shrink-0 bg-white w-full p-4 rounded-md shadow-sm cursor-pointer transition-transform duration-300 ease-in-out hover:scale-[1.001] space-x-6"
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
            <div className="flex flex-col">
              <div className="font-semibold text-secondary">{`${student.studentNumber}`}</div>
              <div className="font-medium text-orange-500">{`${student.studyProgramme}`}</div>
            </div>
          </div>
        </div>

        {/* Engage button opens dialog; stop card navigation */}
        <AlertDialogTrigger asChild>
          <button
            type="button"
            onClick={stopCardClick}
            className="flex flex-col items-center"
          >
            <div className="h-14 w-14 rounded-full text-slate-500 text-opacity-65 flex items-center hover:bg-gray-100 justify-center">
              <Send className="h-11 w-11 cursor-pointer p-2 pointer-events-auto" />
            </div>
            <p className="text-slate-500 font-semibold">Engage</p>
          </button>
        </AlertDialogTrigger>
      </div>

      {/* Engage dialog content */}
      <AlertDialogContent className="text-black">
        <AlertDialogHeader>
          <AlertDialogTitle>Engage Student</AlertDialogTitle>
          <AlertDialogDescription className="space-y-2">
            Send a short message to{" "}
            <span className="font-medium text-secondary">
              {student.name} {student.surname}
            </span>
            .
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="flex flex-col space-y-2">
          <label htmlFor="engage-message" className="default-label">
            Message
          </label>
          <textarea
            id="engage-message"
            className="input min-h-28 w-full"
            placeholder={`Type your message to ${student.name}…`}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          {message.trim().length === 0 && (
            <p className="text-sm text-red-500">Message cannot be empty</p>
          )}
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel
            type="button"
            className="min-w-[100px]"
            onClick={() => setEngageOpen(false)}
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            type="submit"
            onClick={onEngageSubmit}
            className="min-w-[100px] bg-secondary hover:bg-secondary hover:bg-opacity-85 text-white disabled:opacity-50"
            disabled={message.trim().length === 0}
          >
            Send
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default StudentCard;
