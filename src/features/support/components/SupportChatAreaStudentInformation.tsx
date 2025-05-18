import { BsCalendarEvent } from "react-icons/bs";
import { HiAcademicCap } from "react-icons/hi";
import { IoPhonePortraitOutline } from "react-icons/io5";
import { MdEmail } from "react-icons/md";
import { useEffect, useRef } from "react";
import { IoMdClose } from "react-icons/io";
import { useSupportChats } from "../context/supportContext";
import { useNavigate } from "react-router-dom";

const SupportChatAreaStudentInformation = () => {
  const navigate = useNavigate();

  const { selectedChat, isStudentInfoPaneOpen, setIsStudentInfoPaneOpen } =
    useSupportChats();

  const sidePaneRef = useRef<HTMLDivElement | null>(null);

  const handleOutsideClick = (event: MouseEvent): void => {
    if (
      sidePaneRef.current &&
      !sidePaneRef.current.contains(event.target as Node)
    ) {
      setIsStudentInfoPaneOpen(false);
    }
  };

  const viewStudentProfile = () => {
    navigate(
      `/students/${selectedChat?.user.name + "-" + selectedChat?.user.surname}`,
      {
        state: selectedChat?.user,
      }
    );
  };

  useEffect(() => {
    const attachListener = () => {
      document.addEventListener("click", handleOutsideClick);
    };

    const detachListener = () => {
      document.removeEventListener("click", handleOutsideClick);
    };

    if (isStudentInfoPaneOpen) {
      setTimeout(attachListener, 0);
    } else {
      detachListener();
    }

    return () => detachListener();
  }, [isStudentInfoPaneOpen]);

  return (
    <div
      ref={sidePaneRef}
      className="fixed top-0 right-0 h-screen space-y-2  w-96 bg-pageBackground shadow-lg border-l border-gray-300 z-50 text-black overflow-y-auto pb-2 "
    >
      <div className="p-4 bg-white">
        <div className="flex items-center justify-start space-x-4 top-0 left-0 sticky bg-white">
          <div
            className="hover:bg-gray-100 h-12 w-12 rounded-full flex items-center justify-center cursor-pointer "
            onClick={() => setIsStudentInfoPaneOpen(false)}
          >
            <IoMdClose className="h-6 w-6 text-slate-500 " />
          </div>
          <h2 className="text-lg font-medium">Student info</h2>
        </div>

        <div className="flex flex-col items-center justify-center mt-12 space-y-8">
          <div className="h-36 w-36 rounded-full bg-secondary flex items-center justify-center text-white text-4xl">
            {selectedChat?.user.profilePicture ? (
              <img
                className="h-36 w-36 rounded-full items-center justify-center"
                src={selectedChat?.user.profilePicture}
              />
            ) : (
              selectedChat!.user.name.charAt(0) +
              selectedChat!.user.surname.charAt(0)
            )}
          </div>

          <div className="flex  flex-col items-center justify-center pb-8">
            <p className="text-lg font-semibold ">
              {`${selectedChat?.user.name} ${selectedChat?.user.surname}`}
            </p>
            <p className="text-gray-400">{selectedChat?.user.studentNumber}</p>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center ">
          <button
            className="ml-4 px-4 py-2 bg-secondary text-base text-white rounded-lg w-44"
            onClick={viewStudentProfile}
          >
            View Profile
          </button>
        </div>
      </div>

      <div className="bg-white p-4 space-y-4">
        <p className="text-slate-500">Academic</p>
        <div className=" space-y-2">
          <div className="flex items-center justify-start space-x-3">
            <HiAcademicCap className="h-6 w-6 text-slate-500" />
            <p>{selectedChat?.user.studyProgramme}</p>
          </div>
          <div className="flex items-center justify-start space-x-3">
            <BsCalendarEvent className="h-6 w-6 text-slate-500" />
            <p>Level of study: {selectedChat?.user.levelOfStudy}</p>
          </div>
        </div>
      </div>

      <div className="bg-white p-4 space-y-4">
        <p className="text-slate-500">Contact</p>
        <div className=" space-y-2">
          {selectedChat?.user.cellphoneNumber && (
            <div className="flex items-center justify-start space-x-3">
              <IoPhonePortraitOutline className="h-6 w-6 text-slate-500" />
              <p>{selectedChat?.user.cellphoneNumber}</p>
            </div>
          )}
          <div className="flex items-center justify-start space-x-3">
            <MdEmail className="h-6 w-6 text-slate-500" />
            <p>{selectedChat?.user.email}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupportChatAreaStudentInformation;
