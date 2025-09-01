import { useEffect, useRef, useState } from "react";
import { IoSend } from "react-icons/io5";
import {  MdExpandLess, MdExpandMore } from "react-icons/md";
import { AiOutlineFileDone } from "react-icons/ai";
import { GoCrossReference } from "react-icons/go";
import SupportChatAreaFooterActionButton, {
  SupportChatAreaFooterActionButtonSkeleton,
} from "./SupportChatAreaFooterActionButton";
import { useSupportChats } from "../context/supportContext";
import CircularLoadingSpinner from "@/components/CircularLoadingSpinner";
import ChatPendingResolveCard from "./ChatPendingResolveCard";
import { AlertDialogTrigger } from "@radix-ui/react-alert-dialog";
import { useForm } from "react-hook-form";
import { ReferChatSchema } from "@/app/models/Step";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  CheckCircleIcon,
  Circle,
} from "lucide-react";
import { useAuth } from "@/app/context/authContext";

const SupportChatAreaFooter = () => {
  const {
    sendChatMessage,
    sendChatMessageLoading,
    selectedChat,
    resolveChat,
    selectChat,
    referChatLoading,
    referChat,
    admins,
  } = useSupportChats();

  const { user } = useAuth();

  const [message, setMessage] = useState<string>("");

  const [adminId, setAdminId] = useState<string>("");
  const [showActions, setShowActions] = useState(true);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const maxRows = 4;

  const { register, handleSubmit, setValue, reset } =
    useForm<ReferChatSchema>();

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.rows = 1;
      const currentRows = Math.min(
        textareaRef.current.scrollHeight / 24,
        maxRows
      );
      textareaRef.current.rows = Math.floor(currentRows);
    }
  }, [message]);

  const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    e.preventDefault();
    setMessage(e.target.value);
  };

  const sendMessage = async () => {
    if (message) {
      sendChatMessage({ message: message! });
      setMessage("");
    }
  };

  const referChatDialogActionClick = () => {
    setValue("referralNotes", "");
    setValue("referralAdmin", "");
  };

  const submitReferral = async (data: ReferChatSchema) => {
    if (referChatLoading) return;

    await referChat({
      referralNotes: data.referralNotes,
      administrator: data.referralAdmin,
    });
  };

  const cancelReferChat = () => {
    reset({
      referralNotes: "",
      referralAdmin: "",
    });
    setAdminId("");
  };

  return (
    <AlertDialog>
      <div className="h-fit bg-pageBackground p-4 flex flex-col items-center border-t border-gray-300">
        {selectedChat &&
        selectedChat.referredBy &&
        selectedChat.referredBy === user?.id ? (
          <div className="items-center justify-center flex flex-col px-4 bg-orange-500 bg-opacity-10 rounded-md py-6 w-full">
            <p className="text-orange-500 font-semibold text-lg">
              You referred this case to another administrator.
            </p>
          </div>
        ) : (
          <>
            {(selectedChat?.status === "In Progress" ||
              selectedChat?.status === "New" || selectedChat?.status === "Engage") && (
              <div className="flex w-full my-2 items-end">
                <textarea
                  rows={1}
                  placeholder="Type a message..."
                  ref={textareaRef}
                  value={message}
                  onChange={handleMessageChange}
                  className="w-full place-content-center content-center rounded-lg border message-input overflow-auto resize-none "
                />
                {(  message) && !/^[\s]*$/.test(message!) && (
                  <button
                    onClick={sendMessage}
                    className="ml-4 p-3 flex items-center justify-center bg-secondary text-xl h-10 w-10 text-white rounded-lg"
                  >
                    {sendChatMessageLoading ? (
                      <CircularLoadingSpinner
                        className="flex items-center w-full justify-center "
                        color="white"
                      />
                    ) : (
                      <IoSend />
                    )}
                  </button>
                )}
                {/^[\s]*$/.test(message!) &&  selectedChat?.status !=="Engage" && (
                  <button
                    onClick={() => {
                      setShowActions((prev) => !prev);
                    }}
                    className="ml-4  flex bg-secondary text-2xl h-10 w-10 items-center justify-center text-white rounded-lg"
                  >
                    {!showActions  ? <MdExpandMore /> : <MdExpandLess />}
                  </button>
                )}
              </div>
            )}

            {
              <div className="flex space-x-4 mt-4 justify-start w-full">
                {(selectedChat?.status === "In Progress" ||
                  selectedChat?.status === "New") && (
                  <>
                    <SupportChatAreaFooterActionButton
                      title="Resolve"
                      icon={AiOutlineFileDone}
                      onTap={() => {
                        resolveChat({ chatId: selectedChat.id });
                        selectChat(undefined);
                      }}
                    />

                    <AlertDialogTrigger>
                      <SupportChatAreaFooterActionButton
                        title="Refer"
                        icon={GoCrossReference}
                        onTap={() => {
                          referChatDialogActionClick();
                          // selectChat(undefined);
                        }}
                      />
                    </AlertDialogTrigger>
                  </>
                )}

                {selectedChat?.status === "Pending Resolve" && (
                  <ChatPendingResolveCard />
                )}
              </div>
            }
          </>
        )}

        {selectedChat?.status === "Resolved" && (
          <div className="items-center justify-center flex flex-col px-4 bg-green-500 bg-opacity-10 rounded-md py-6 w-full">
            <p className="text-green-500 font-semibold text-lg">
              This chat has been resolved and cannot be updated.
            </p>
          </div>
        )}

        <form id="refer-case-form" onSubmit={handleSubmit(submitReferral)}>
          <AlertDialogContent className="text-black  overflow-y-auto">
            {admins.length !== 0 && (
              <AlertDialogHeader>
                <AlertDialogTitle className="text-secondary">
                  Refer Case
                </AlertDialogTitle>
                <AlertDialogDescription className="space-y-4">
                  Please select an administrator to refer this chat to. Once
                  referred you will not be able to make changes or respond to
                  this case unless it's referred back to you.
                </AlertDialogDescription>
              </AlertDialogHeader>
            )}

            <div className="flex flex-col items-start">
              <label
                htmlFor="referral-notes"
                className="font-medium text-gray-500 my-4"
              >
                Referral Notes
              </label>
              <textarea
                id="referral-notes"
                className="w-full new-step-input resize-none"
                placeholder="Enter referral notes here... Keep it short"
                {...register("referralNotes", { required: true })}
              />
            </div>

            {admins.length !== 0 && (
              <div className="w-full pb-8">
                <p className="font-medium text-gray-500 my-4">
                  Program administrators
                </p>
                {admins.map((admin) => {
                  return (
                    <div
                      onClick={() => {
                        setAdminId(admin.id);
                        setValue("referralAdmin", admin.id);
                      }}
                      className={`${
                        adminId === admin.id &&
                        "border border-secondary border-solid rounded-xl"
                      } bg-white  cursor-pointer hover:bg-slate-50 text-gray-600 p-4 flex justify-between items-center`}
                      key={admin.id}
                    >
                      <div className=" flex items-center gap-4">
                        <div className="h-16 w-16 shrink-0 rounded-full bg-secondary text-white text-2xl font-medium flex items-center justify-center">
                          {admin.avatar ? (
                            <img
                              className="h-16 w-16 rounded-full items-center justify-center"
                              src={admin.avatar}
                            />
                          ) : (
                            admin.name.charAt(0) + admin.surname.charAt(0)
                          )}
                        </div>

                        <div>
                          <p className="font-semibold">
                            {admin.name + " " + admin.surname}
                          </p>
                          <p className="text-sm text-orange-500">
                            {admin.categories.map(
                              (category, index) =>
                                `${category} ${
                                  index !== admin.categories.length - 1
                                    ? ","
                                    : ""
                                }`
                            )}
                          </p>
                        </div>
                      </div>
                      {adminId === admin.id && (
                        <CheckCircleIcon className="text-secondary" />
                      )}

                      {adminId !== admin.id && (
                        <Circle className="text-secondary" />
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {admins.length === 0 && (
              <div>
                Your're the only administrator of this program so you can't
                refer cases to anyone within Axola.
              </div>
            )}

            <AlertDialogFooter>
              <AlertDialogCancel
                className="min-w-[100px]"
                onClick={cancelReferChat}
              >
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                type="submit"
                form="refer-case-form"
                className="min-w-[100px] bg-secondary hover:bg-secondary hover:bg-opacity-85 text-white"
              >
                {referChatLoading && (
                  <CircularLoadingSpinner
                    className="flex items-center w-full justify-center"
                    color="white"
                  />
                )}
                <p>Refer Case</p>
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </form>
      </div>
    </AlertDialog>
  );
};

export default SupportChatAreaFooter;

export const SupportChatAreaFooterSkeleton = () => {
  return (
    <div className="h-fit bg-pageBackground p-4 flex flex-col items-center border-t border-gray-300 text-transparent select-none">
      <div className="flex w-full my-2">
        <div className="w-full bg-secondary bg-opacity-20 h-10 rounded-md">
          _
        </div>
        <div className="ml-4 p-3 bg-secondary bg-opacity-20 rounded-lg h-10 w-10">
          _
        </div>
      </div>

      <div className="flex space-x-4 mt-4 justify-start w-full">
        <SupportChatAreaFooterActionButtonSkeleton />
        <SupportChatAreaFooterActionButtonSkeleton />
      </div>
    </div>
  );
};
