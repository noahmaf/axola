const StepCardSkeleton = () => {
  return (
    <div className="  bg-white w-full flex  items-center h-fit text-transparent p-4 space-x-3">
      <div className="rounded-t-md h-[150px] w-[150px] shrink-0 bg-secondary bg-opacity-20  shadow-sm text-transparent">
        _
      </div>

      <div className=" flex flex-col gap-1 rounded-r-md shadow-sm  h-full w-full ">
        <div className="w-[65%] bg-secondary bg-opacity-20 rounded-md ">
          _________________________
        </div>
        <p className=" bg-secondary rounded-md bg-opacity-20 w-fit mt-1">
          __________________________________
        </p>
        <div className=" font-medium line-clamp-2 w-full space-y-1">
          <p className="bg-secondary bg-opacity-20 w-[40%] rounded-md">_</p>
          <p className="bg-secondary bg-opacity-20 w-[30%] rounded-md">
            ___________________________
          </p>
        </div>

        <p className="mt-2 bg-secondary bg-opacity-20 rounded-md w-[50%]">
          ______________
        </p>
      </div>
    </div>
  );
};

export default StepCardSkeleton;
