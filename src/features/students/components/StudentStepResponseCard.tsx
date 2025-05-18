import { StepResponse } from "@/app/models/Step";
import { formatChatTimestamp } from "@/app/utils/chatDateFormat";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { v4 as uuidv4 } from "uuid";

const StudentStepResponseCard = ({
  stepResponse,
}: {
  stepResponse: StepResponse;
}) => {
  return (
    <AlertDialog>
      <AlertDialogTrigger key={stepResponse.id}>
        <div className="bg-white shadow-sm py-4 pl-8 pr-4 cursor-pointer hover:bg-secondary hover:bg-opacity-5  flex h-fit items-center select-none">
          <div className="h-20 w-20 shrink-0 rounded-full bg-secondary bg-opacity-30 flex items-center justify-center">
            <img
              className="h-20 w-20 rounded-full items-center justify-center"
              src={stepResponse.stepInfo.image}
            />
          </div>

          <div className="ml-4 flex flex-col items-start justify-center w-full ">
            <p className="font-semibold text-black">
              {stepResponse.stepInfo.title}
            </p>
            <p
              className="text-gray-500
        
           text-base font-medium"
            >
              {stepResponse.stepInfo.description}
            </p>
          </div>

          <div className="flex flex-col justify-center space-y-4 items-end">
            <p className="text-gray-500 text-base font-medium">
              {formatChatTimestamp(stepResponse.submitDate)}
            </p>
          </div>
        </div>
      </AlertDialogTrigger>

      <AlertDialogContent className="text-black">
        <AlertDialogHeader>
          <AlertDialogTitle className="select-none">
            Step Response
          </AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogDescription></AlertDialogDescription>
        <div className="flex flex-col space-y-8 select-none h-[600px]">
          <div className="flex flex-col w-full space-y-3 text-neutral-600 bg-neutral-200 bg-opacity-35 rounded-md p-4  border-orange-500 border-dashed border-2">
            <div className="flex flex-col">
              <p className="text-secondary font-semibold ">Title</p>
              <p>{stepResponse.stepInfo.title}</p>
            </div>

            <div className="flex flex-col">
              <p className="text-secondary font-semibold ">Description</p>
              <p>{stepResponse.stepInfo.description}</p>
            </div>

            <div className="flex flex-col">
              <p className="text-secondary font-semibold ">Submission Date</p>
              <p>{formatChatTimestamp(stepResponse.submitDate)}</p>
            </div>
          </div>

          <div className="flex flex-col space-y-4  overflow-y-auto  h-[100%]">
            {Object.entries(stepResponse.response).map(
              ([question, answer], __) => {
                return (
                  <div
                    key={uuidv4()}
                    className="flex flex-col bg-secondary bg-opacity-10 p-3 rounded-md space-y-2"
                  >
                    <p className="text-orange-500 font-semibold text-sm ">
                      {question}
                    </p>
                    <p>{answer as string}</p>
                  </div>
                );
              }
            )}
          </div>
        </div>
        <AlertDialogFooter>
          <AlertDialogAction className="bg-secondary text-white hover:bg-secondary hover:bg-opacity-80 min-w-[100px] flex">
            <p>Done</p>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default StudentStepResponseCard;
