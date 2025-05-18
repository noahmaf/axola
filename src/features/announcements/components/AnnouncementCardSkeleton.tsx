const AnnouncementCardSkeleton = () => {
  return (
    <div className="bg-white  h-fit p-2 rounded-md shadow-lg text-transparent w-full">
      <div className="flex items-center justify-between ">
        <p className="text-base font-semibold w-[50%] bg-secondary  bg-opacity-20 rounded-md">
          _ <title></title>
        </p>
        <div className=" flex ">
          <button className="h-10 w-10 text-gray-500 hover:text-secondary rounded-full hover:bg-opacity-10  flex items-center justify-center"></button>

          <button className=" h-10 w-10  text-red-500 hover:bg-red-500 rounded-full hover:bg-opacity-10 flex items-center justify-center"></button>
        </div>
      </div>

      <p className="text-sm bg-secondary  bg-opacity-20 font-medium text-start w-[45%] rounded-md">
        _
      </p>

      <p className="mt-2 text-sm bg-secondary  bg-opacity-20 font-medium w-[15%] rounded-md">
        _
      </p>
    </div>
  );
};

export default AnnouncementCardSkeleton;
