const StudentStepResponseDataTableSkeleton = () => {
  return (
    <div className="w-full flex flex-col space-y-2">
      <div className="bg-secondary animate-pulse bg-opacity-15 text-transparent p-3 rounded-md">
        _
      </div>
      {Array.from({ length: 5 }, (_, __) => {
        return (
          <div
            className="flex flex-col w-full animate-pulse select-none"
            key={__}
          >
            <div className="bg-white shadow-sm text-transparent py-2 rounded-sm flex items-center space-x-2">
              <div className="w-[30%] bg-secondary bg-opacity-15  rounded-sm">
                _
              </div>
              <div className="w-[25%] bg-secondary bg-opacity-15  rounded-sm">
                _
              </div>
              <div className="w-[20%] bg-secondary bg-opacity-15  rounded-sm">
                _
              </div>
              <div className="w-[25%] bg-secondary bg-opacity-15  rounded-sm">
                _
              </div>
            </div>
            <div className="bg-gray-100 h-1"></div>
          </div>
        );
      })}
    </div>
  );
};

export default StudentStepResponseDataTableSkeleton;
