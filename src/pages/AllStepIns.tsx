import NewStepIn from "@/features/step-ins/components/NewStepIn";
import PublishedStepIns from "@/features/step-ins/components/PublishedStepIns";

const AllStepIns = () => {
  return (
    <div className="flex-1 overflow-y-auto bg-white flex md:flex-row gap-6 p-4">
      <PublishedStepIns />
      <div className="w-full ">
        <NewStepIn />
      </div>
    </div>
  );
};

export default AllStepIns;
