import { useSteps } from "../context/stepsContext";
import StepCard from "@/features/step-ins/components/StepCard";
import StepCardSkeleton from "./StepCardSkeleton";
import EmptyResponses from "@/assets/images/empty-step-responses.png";

const PublishedStepIns = () => {
  const { steps, stepsLoading } = useSteps();

  return (
    <div
      className={`
      overflow-y-auto 
      flex flex-col gap-2  bg-gray-100 w-full md:w-[80%]  text-black rounded-md p-3 select-none`}
    >
      <div className="bg-white rounded-lg p-3 shadow-lg text-center font-semibold text-lg  top-0  ">
        {stepsLoading ? (
          <p className="bg-secondary bg-opacity-20 text-transparent rounded-md w-fit animate-pulse">
            _______________________________
          </p>
        ) : (
          <p>Published Steps</p>
        )}
      </div>
      {stepsLoading ? (
        <div className="flex flex-col w-full gap-1 pt-[6px] animate-pulse">
          <StepCardSkeleton />
          <StepCardSkeleton />
          <StepCardSkeleton />
          <StepCardSkeleton />
        </div>
      ) : steps.length === 0 ? (
        <div className="flex flex-col  items-center justify-center text-center space-y-12 p-24">
          <img className="h-32 " src={EmptyResponses} />
          <p className=" text-lg font-medium  text-neutral-500">
            No steps have been published yet.
          </p>
        </div>
      ) : (
        <div className="flex flex-col w-full gap-1 pt-[6px]">
          {steps.map((publishedStep) => {
            return <StepCard key={publishedStep.id} step={publishedStep} />;
          })}
        </div>
      )}
    </div>
  );
};

export default PublishedStepIns;
