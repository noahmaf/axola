import { SupportChat } from "@/app/models/SupportChat";
import { formatChatTimestamp } from "@/app/utils/chatDateFormat";
import { useSupportChats } from "@/features/support/context/supportContext";
import { useNavigate } from "react-router-dom";
import Financial from "@/assets/images/categories/financial.png";
import Academic from "@/assets/images/categories/academic.png";
import Accommodation from "@/assets/images/categories/accommodation.png";
import LearningResources from "@/assets/images/categories/learning_resources.png";
import General from "@/assets/images/categories/general.png";

const StudentChatCard = ({ chat }: { chat: SupportChat }) => {
  const { selectChat, setChatFilter } = useSupportChats();
  const navigate = useNavigate();

  let categoryImage;
  switch (chat.category) {
    case "Financial":
      categoryImage = Financial;
      break;
    case "Accommodation":
      categoryImage = Accommodation;
      break;
    case "Academic":
      categoryImage = Academic;
      break;
    case "Learning Resources":
      categoryImage = LearningResources;
      break;
    case "Registration":

    case "General":

    default:
      categoryImage = General;
      break;
  }

  return (
    <div
      onClick={() => {
        selectChat(chat);
        setChatFilter(chat.status);
        navigate("/support");
      }}
      className="bg-white shadow-sm py-4 pl-8 pr-4 cursor-pointer hover:bg-secondary hover:bg-opacity-5  flex h-fit items-center  select-none"
    >
      <div className="h-20 w-20 shrink-0 rounded-full bg-slate-200 flex items-center justify-center">
        <img
          className="h-14 w-14 rounded-full items-center justify-center"
          src={categoryImage}
        />
      </div>

      <div className="ml-4 flex flex-col items-start justify-center w-full ">
        <p className="font-semibold text-black">{`${chat.title}`}</p>
        <p
          className={`${
            chat.latestMessage.read === false &&
            chat.latestMessage.administrator === null
              ? "text-orange-500"
              : "text-gray-500"
          }
           text-base font-medium`}
        >
          {chat.latestMessage.content}
        </p>
      </div>

      <div className="flex flex-col justify-center space-y-4 items-end w-full">
        <p
          className={`${
            chat.latestMessage.read === false &&
            chat.latestMessage.administrator === null
              ? "text-orange-500"
              : "text-gray-500"
          }
           text-base font-medium`}
        >
          {formatChatTimestamp(chat.latestMessage.dateCreated)}
        </p>
        <div
          className={`${
            chat.category === "Accommodation"
              ? "bg-orange-500"
              : chat.category === "Academic"
              ? "bg-blue-500"
              : chat.category === "Financial"
              ? "bg-green-500"
              : chat.category === "Learning Resources"
              ? "bg-pink-500"
              : chat.category === "Registration"
              ? "bg-yellow-500"
              : chat.category === "General"
              ? "bg-purple-500"
              : ""
          } bg-opacity-10 px-4 flex w-fit shrink-0 py-1 rounded-full justify-center items-center text-center`}
        >
          <p
            className={`${
              chat.category === "Accommodation"
                ? "text-orange-500"
                : chat.category === "Academic"
                ? "text-blue-500"
                : chat.category === "Financial"
                ? "text-green-500"
                : chat.category === "Learning Resources"
                ? "text-pink-500"
                : chat.category === "Registration"
                ? "text-yellow-500"
                : chat.category === "General"
                ? "text-purple-500"
                : ""
            } text-sm font-semibold`}
          >
            {chat.category}
          </p>
        </div>
      </div>
    </div>
  );
};

export default StudentChatCard;
